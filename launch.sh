function launch {
  local version socketHost socketPort custom
  echo '  checking node...'
  version=$(`which node` --version 2>/dev/null)
  [ $? != 0 ] && echo '  ERROR: node.js is not installed!' && return;

  echo "  node.js is installed! (version: $version)"


  while true; do
    read -p "  do you want to specify a different host/port (y/N)? " yn
    case $yn in
      [Yy]* ) custom=1; break;;
      [Nn]* ) custom=0; break;;
      * ) custom=0; break;;
    esac
  done
  
  if [ $custom = 1 ]; then
    read -p "  host: " sockethost
    read -p "  port: " socketPort
  else
    socketHost="http://127.0.0.1"
    socketPort="8080"
  fi

  echo "  creating config file for $socketHost:$socketPort"
  touch app/config.json
  
  echo "{\"host\":\"$socketHost\", \"port\":\"$socketPort\"}" > app/config.json

  echo "  firing up the server..."
  `which node` app/server.js
}

launch
