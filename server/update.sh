sudo apt-get update
sudo npm i 
mysql -u SmartCoast --password=123VORbei! -e "source /home/pi/server/esp_ble.sql"
sudo service mariadb restart
sudo cp beta.service  /lib/systemd/system/
sudo chmod 644 /lib/systemd/system/beta.service
sudo systemctl daemon-reload
sudo systemctl enable beta.service
sudo service beta start
sudo service updater stop
