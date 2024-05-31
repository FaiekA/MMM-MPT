# MMM-MPT
Magic Mirror Module of Muslim Prayer Times



![Screenshot 2024-05-31 175148](https://github.com/FaiekA/MMM-MPT/assets/52759676/f407306f-a487-439b-a665-7b9314d4cb48)

#config 
To add the module do the following which also shows the configurable values:

````javascript
	{
	    module: 'MMM-MPT',
		animateIn: 'backInRight',
		animateOut: 'backOutRight',			
	    position: 'bottom_right', // This can be any of the regions, best results in center regions
	    config: {
                updateInterval: 1 * 60 * 60 * 1000, // every hours
			    latitude: -26.326160,  //defaults to Konya / Meram.
			    longitude: 26.817346,
			    timeZoneString: "Africa/Johannesburg", // https://www.php.net/manual/en/timezones.php
			    method: 3, //You can see in below the config.
			    school: 0, //"school" - Optional. 0 for Shafii, 1 for Hanfi. If you leave this empty, it defaults to Shafii.
				header: "Salaah Times", // Added header default value
       			adhanEnabled: false	// Initial button state // Add a default value for adhan playback enabled/disabled		    
	    }
	}, 
````
````javascript
METHODS:

0 - Shia Ithna-Ansari
1 - University of Islamic Sciences, Karachi
2 - Islamic Society of North America
3 - Muslim World League
4 - Umm Al-Qura University, Makkah
5 - Egyptian General Authority of Survey
7 - Institute of Geophysics, University of Tehran
8 - Gulf Region
9 - Kuwait
10 - Qatar
11 - Majlis Ugama Islam Singapura, Singapore
12 - Union Organization islamic de France
13 - Diyanet İşleri Başkanlığı, Turkey
14 - Spiritual Administration of Muslims of Russia
15 - Moonsighting Committee Worldwide (also requires shafaq parameter)
16 - Dubai (unofficial)
````
# Install the module
````javascript
cd ~/MagicMirror/modules
git clone [https://github.com/uok825/MMM-IPT.git](https://github.com/FaiekA/MMM-MPT.git)
Copy-Paste config texts. Thanks.
````
Thanks for to  uok825/MMM-IPT
