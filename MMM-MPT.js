Module.register("MMM-MPT", {
        defaults: {
            updateInterval: 4 * 60 * 60 * 1000, // every 4 hours
            initLoadDelay: 0,
            retryDelay: 2500,
            latitude: 37.861676,  // defaults to Norwalk, CT, US
            longitude: 32.4641803,
            timeZoneString: "Europe/Istanbul",
            method: 13, // https://aladhan.com/prayer-times-api
            timingsApi: 'http://api.aladhan.com/v1/timings/', 
            school: 1, // 0 for Shafii, 1 for Hanfi. Defaults to Shafii.
            adhanEnabled: true, // Add a default value for adhan playback enabled/disabled
            header: "Prayer Times" // Added header default value
        },
        
        getStyles: function() {
            return ["MMM-MPT.css"]; // Include your CSS file here
        },    
    
        start: function() {
            Log.info("starting module " + this.name);
            this.loaded = false;
            this.result = null;
            this.adhan_src = this.config.adhanSrc;
            this.scheduleUpdate(this.config.initLoadDelay);
        },
        
        getDateObj: function(time_str) {
            var now = new Date();
            var tmp = time_str.split(':');
            var hour = parseInt(tmp[0]);
            var min = parseInt(tmp[1]);
            
            var d = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, min, 0);
            return d;
        },
        
        getFormattedTime: function(time_str) {
            var tmp = time_str.split(':');
            var minute = tmp[1];
            var old_hour = tmp[0];
            var am_pm = "AM";
    
            var new_hour_str = old_hour;
            var new_hour = parseInt(old_hour);
            if (new_hour >= 12) { 
                am_pm = "PM";
            }
    
            if (new_hour > 12) {
                new_hour = new_hour - 12; // Corrected subtraction
                new_hour_str = new_hour < 10 ? '0' + new_hour : new_hour;
            } else if (new_hour === 0) {
                new_hour_str = "12";
            }
            return new_hour_str + ':' + minute + ' ' + am_pm;
        },
    
        playAdhan: function() {
            if (this.config.adhanEnabled) {
                Log.info("Playing adhan now. SRC: " + this.config.adhanSrc);
                var audio = new Audio(this.file("adhan.mp3")); // assuming adhan.mp3 is the name of your local audio file
                audio.play();
        
                // Add the flash effect to the current prayer time entry
                var currentPrayerDiv = document.getElementById("currentPrayer");
                if (currentPrayerDiv) {
                    currentPrayerDiv.classList.add("flash");
        
                    // Remove the flash effect after two minutes
                    setTimeout(function() {
                        currentPrayerDiv.classList.remove("flash");
                    }, 2 * 60 * 1000); // Two minutes in milliseconds
                }
            }
        },
        
        
    
// Override dom generator.
getDom: function() {
    var wrapper = document.createElement("div");

    // Add header to the module
    if (this.config.header) {
        var header = document.createElement("header");
        header.innerHTML = this.config.header;
        header.className = "module-header"; // Add a class for styling
        wrapper.appendChild(header);
    }

    if (this.loaded) {
        var timings = this.result.data.timings;
        var keys = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
        var dates = {};

        for (var i = 0; i < keys.length; ++i) {
            var key = keys[i];
            var date = this.getDateObj(timings[key]);
            dates[key] = date;

            // Schedule the playAdhan function to be called at the prayer time
            var now = new Date();
            if (date > now) {
                var timeUntilAdhan = date - now;
                setTimeout(this.playAdhan.bind(this), timeUntilAdhan);
            }
        }

        for (var i = 0; i < keys.length; ++i) {
            var key = keys[i];
            var prayerDiv = document.createElement("div");
            prayerDiv.className = "prayer-time";
            prayerDiv.id = key === this.currentPrayer ? "currentPrayer" : ""; // Assign ID if it's the current prayer

            // Create and append the prayer name div
            var nameDiv = document.createElement("div");
            nameDiv.className = "prayer-name";
            nameDiv.innerHTML = key;
            prayerDiv.appendChild(nameDiv);

            // Create and append the prayer time div
            var timeDiv = document.createElement("div");
            timeDiv.className = "prayer-time-value";
            timeDiv.innerHTML = this.getFormattedTime(timings[key]);
            prayerDiv.appendChild(timeDiv);

            wrapper.appendChild(prayerDiv);
        }

        // Identify the upcoming and next prayer
        var upcomingPrayer = null;
        var nextPrayer = null;
        for (var i = 0; i < keys.length; ++i) {
            var key = keys[i];
            if (dates[key] > new Date()) {
                upcomingPrayer = key;
                nextPrayer = keys[i + 1]; // Get the next prayer time
                break;
            }
        }

        // Style the upcoming prayer time in orange
        if (upcomingPrayer) {
            var upcomingPrayerDiv = document.getElementById(upcomingPrayer);
            if (upcomingPrayerDiv) {
                upcomingPrayerDiv.classList.add("upcoming-prayer");
            }
        }

        // Style the next prayer time in orange until its scheduled time
        if (nextPrayer) {
            var nextPrayerDiv = document.getElementById(nextPrayer);
            if (nextPrayerDiv) {
                nextPrayerDiv.classList.add("next-prayer");
            }
        }

        // Create a button for toggling adhan playback
        var toggleAdhanButton = document.createElement("button");
        toggleAdhanButton.innerHTML = this.config.adhanEnabled ? "Disable Adhan" : "Enable Adhan";
        toggleAdhanButton.className = "toggle-button"; // Correct class name for styling
        toggleAdhanButton.addEventListener("click", this.toggleAdhanPlayback.bind(this));
        wrapper.appendChild(toggleAdhanButton);
    } else {
        wrapper.innerHTML = "Loading...";
        Log.info("Still not loaded yet");
    }
    
    return wrapper;
},




    processTimings: function(data) {
        this.loaded = true;
        this.result = data;

        // Determine the current prayer
        var now = new Date();
        var timings = this.result.data.timings;
        var keys = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
        var dates = {};

        for (var i = 0; i < keys.length; ++i) {
            var key = keys[i];
            var date = this.getDateObj(timings[key]);
            dates[key] = date;

            if (date > now) {
                this.currentPrayer = key;
                break;
            }
        }

        this.updateDom(this.config.animationSpeed);
    },

    
        updateTimings: function() {
            var currentDate = new Date();
            var url = `${this.config.timingsApi}${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}?longitude=${this.config.longitude}&latitude=${this.config.latitude}&method=${this.config.method}&school=${this.config.school}`;
            var self = this;
            
            var request = new XMLHttpRequest();
            Log.info(url)
            request.open("GET", url, true);
            request.onreadystatechange = function() {
                if (this.readyState === 4) {
                    if (this.status === 200) {
                        self.processTimings(JSON.parse(this.response));
                    } else {
                        Log.error("Got error. Failed to fetch timings");
                    }
                }
            };      
            request.send();
        },
    
        toggleAdhanPlayback: function() {
            this.config.adhanEnabled = !this.config.adhanEnabled;
            this.updateDom();
        },
    
        /* scheduleUpdate()
         * Schedule next update.
         *
         * argument delay number - Milliseconds before next update. If empty, this.config.updateInterval is used.
         */
        scheduleUpdate: function(delay) {
            var nextLoad = this.config.updateInterval;
            if (typeof delay !== "undefined" && delay >= 0) {
                nextLoad = delay;
            }
    
            var self = this;
            setTimeout(function() {
                self.updateTimings();
            }, nextLoad);
        },
    });
    
    