#!/bin/bash

script=$(realpath "$0")
script_path=$(dirname "$script")

### Event script setup ###
. ~/.nvm/nvm.sh
nvm install
npm install
node_path=$(which node)

cp .env.template .env
echo ""
read -p "Enter your GitHub username: " github_username
sed -i "s|{github_username}|$github_username|g" ".env"

cp gatefold.sh.template gatefold.sh
chmod +x gatefold.sh
sed -i "s|{script_path}|$script_path|g" "gatefold.sh"
sed -i "s|{node_path}|$node_path|g" "gatefold.sh"


### Raspotify service setup ###
echo ""
echo "Replacing original Raspotify service with our one (don't worry we'll create
a backup). Note: The original Raspotify service runs in a very restricted environment.
Our version has more freedom (required) at the cost of security."
while true; do
    read -p "Do you want to proceed? [y/n] " yn
    case $yn in
        [Yy]* ) break;;
        [Nn]* ) exit;;
        * ) echo "Please answer y or n.";;
    esac
done
sudo mv /lib/systemd/system/raspotify.service /lib/systemd/system/raspotify.service.backup
sudo cp raspotify.service  /lib/systemd/system/
echo ""
echo "Custom Raspotify service created. The original one can still be found at
 '/lib/systemd/system/raspotify.service.backup'."
echo "Simply rename 'raspotify.service.backup' to 'raspotify.service' if you wish to
revert to the original one in future."

### Raspotify config file ###
echo ""
echo "IMPORTANT: Please add the below line to the your Raspotify config file ('/etc/raspotify/conf'):"
echo ""
echo "LIBRESPOT_ONEVENT=\".${script_path}/gatefold.sh\""
echo ""
