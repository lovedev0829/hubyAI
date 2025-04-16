echo "Switching to the development branch ..."
#git checkout development
echo "changing the environment value VITE_HUBY_ENV to integration for build..."
cp .env .env.bak
echo 'VITE_HUBY_ENV = "integration"' > .env
cat .env
echo "Building the app ..."
npm run build 
# mv the backup .env.bak file back.
mv .env.bak .env
echo "Deploying files to server ..."
# note that the location below at server is what's set as the value of root in location / of nginx conf file.
scp -r dist/* dsharma@172.233.128.193:/home/dsharma/huby/backend/dist
echo "Done!"
