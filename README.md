# Tinkerun for Visual Studio Code

The missing way of running tinker in Visual Studio Code, inspired by [Tinkerwell](https://tinkerwell.app/).

### Features
- 🪶 write with typescript only
- 🖖 never leave VSCode
- 🚀 also speed in docker, ssh
- 🥶 simple, you are just creating the PHP files

If you always creating awesome [Laravel](https://laravel.com) project with VSCode, you will never miss it.

## Quick Start
👋 Welcome! Let's start running tinker in Visual Studio Code.

### Step 1
[Install the extension](https://tinke.run)

### Step 2
Press `CMD+Shift+p` then select `Tinkerun: install` to active the extension to your [Laravel](https://laravel.com) project.

![install](https://user-images.githubusercontent.com/1612364/115061614-f8adb880-9f1b-11eb-9cfc-a9bf0c2bd4f7.gif)


The `Tinkerun: install` command will create a `.tinkerun` folder in your project.

```bash
├── .tinkerun
│   ├── inspiring.php // the example code to run
│   ├── tinkerun.json  // the tinkerun config file
```

### Step 3
Open the file `.tinkerun/inspiring.php`, you will see a green ▶️ play button in the upper right corner. Press it.

![run](https://user-images.githubusercontent.com/1612364/115061662-0b27f200-9f1c-11eb-9759-56f80c1a58a5.gif)

The play button read the config from `.tinkerun/tinkerun.json`, 
and open a tinker process with the config, then simulate to input the code from `.tinkerun/inspiring.php`.

You are ready to Go :-) 🎉 🎉 🎉

Create PHP files in the `.tinkerun` folder, and run it via *green play button* or shortcut `CTRL+r`

## tinkerun.json

You can create lots of connections

```js
{
  "connections": [
	// default connection config
    {
      "name": "dev",
      "command": "php artisan tinker"
    },
	// you can also connect docker
	{
      "name": "docker",
      "command": "sail tinker"
    },
	// and connect your ssh server
	{
	  "name": "tinke.run",
      "command": "ssh deloyer@tinke.run -t 'cd /var/www/tinke.run/current && php artisan tinker;bash --login'"
	}
  ]
}
```

then when you are running the PHP file under `.tinkerun` folder.  You will Pick a connection to run at first time.

![pick\_a\_connection](https://user-images.githubusercontent.com/1612364/115065632-f26e0b00-9f20-11eb-989f-05496136ae43.gif)


## Ask for help

If the troubleshooting guides did not resolve the issue, please reach out to me by [filing an issue](https://github.com/tinkerun/tinkerun-vscode/issues/new), [starting a GitHub discussion](https://github.com/tinkerun/tinkerun-vscode/discussions/new)

## License

[MIT](./LICENSE)