zip -r www.zip GeeksNearby-mobile/www

curl -u pwalczys@adobe.com -X PUT -F file=@./www.zip https://build.phonegap.com/api/v1/apps/222384

rm -f www.zip
