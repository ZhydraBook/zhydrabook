# Installazione

```
git clone recursive --depth=1
npm install
```

# Build Prerequisite

## macOS

Use brew to install required packages.

### To build app for Windows on macOS:

```
brew install wine --without-x11
brew install mono
````

### To build app for Linux on macOS:

```
brew install gnu-tar graphicsmagick xz
```

To build rpm: `brew install rpm`.

## Linux

### To build app in distributable format for Linux:

```
sudo apt-get install --no-install-recommends -y icnsutils graphicsmagick xz-utils
```

To build rpm: `sudo apt-get install --no-install-recommends -y rpm`.

To build pacman: `sudo apt-get install --no-install-recommends -y bsdtar`.

### To build app for Windows on Linux:

Install Wine (1.8+ is required):

```
sudo add-apt-repository ppa:ubuntu-wine/ppa -y
sudo apt-get update
sudo apt-get install --no-install-recommends -y wine1.8
```

Install Mono (4.2+ is required):

```
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 3FA7E0328081BFF6A14DA29AA6A19B38D3D831EF
echo "deb http://download.mono-project.com/repo/debian wheezy main" | sudo tee /etc/apt/sources.list.d/mono-xamarin.list
sudo apt-get update
sudo apt-get install --no-install-recommends -y mono-devel ca-certificates-mono
```

### To build app in 32 bit from a machine with 64 bit:

```
sudo apt-get install --no-install-recommends -y gcc-multilib g++-multilib
```

## Travis Linux

Trusty is required — default Travis Linux dist is outdated and icnsutils version is non-functional.

```
sudo: required
dist: trusty
````

Windows

Please use [Docker](https://www.docker.com/).

Pattern: 1Book
Address: 1BookRzXLzwicU4M9abMUh2tSioT86WL6b
Privkey: 5JET3vfJhYrhayBcXCAWrDHsAh3Zwy5eSEyD4Y8VHLES231ny7b
