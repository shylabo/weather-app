init:
	if [ ! -f "js/env.js" ]; then \
		echo "const OPEN_WEATHER_API_KEY = 'YOUR_OPEN_WEATHER_API_KEY';" > js/env.js; \
		echo "const GOOGLE_GEO_API_KEY = 'YOUR_GOOGLE_GEO_API_KEY';" >> js/env.js; \
	fi
