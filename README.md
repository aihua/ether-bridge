# ether-bridge

## Deploy to server

### 1. Use webpack generate production version

```shell
yarn build
```
### 2. Pack and rename `build` folder

```shell
ether-bridge > mv build ether-bridge  // rename `build` folder name to `ether-bridge`
ether-bridge > tar -zcvf ether-bridge.tar.gz ether-bridge  // pack `ether-bridge`
```

### 3. Upload ether-bridge.tar.gz to server

```shell
scp ether-bridge.tar.gz user@remote:/tmp  //use your own server address
```

### 4. Login your server

```shell
ssh user@remote //use your own server address
```

### 5. Unpack ether-bridge

```shell
cd /tmp
mv ether-bridge.tar.gz /var/www
cd /var/www
tar -zxvf ether-bridge.tar.gz  // Unpack ether-bridge
```

### 6. Use a static files server, e.g. [NGINX](https://www.nginx.com/) to serve the ether-bridge directory


