# Form Mode

the Form Mode allow you run your Tinker code with form.

![form-mode](https://user-images.githubusercontent.com/1612364/117542834-d6a3e380-b04c-11eb-93c6-5974177d6ee2.gif)


## How To Use

Write the Tinker code normally, and name the variable that needs to be converted into a form with a [prefix](#prefix). 

for example:

```php
$form_email = 'pmoore@example.net';
$form_password = 'secret';

$user = User::where('email', $form_email)->first();
$user->password = bcrypt($form_password);

$user->save();

$user;
```

the code will create two text fields in the form

![image](https://user-images.githubusercontent.com/1612364/118069408-b66e7e80-b3d6-11eb-96f7-f5d0898a0fb4.png)

## Fields

### `text` field

example:

```php
$form_email = [
    'label' => 'Email',
    'description' => 'the email field description',
    'value' => 'user@example.com',
    'type' => 'text',
]
```

![image](https://user-images.githubusercontent.com/1612364/117540876-d3f0c080-b043-11eb-942d-2d4867d65b67.png)

- `value` is required
- `type` can be `text` `email` `number` etc, it’s same with `<input/>` type property

also you can just use
```php
$form_email = 'user@example.com';
```
is same as 
```php
$form_email = [
    'value' => 'user@example.com',
];
```
	 
### `select` field

example:

```php
$form_lang = [
    'label' => 'Language',
    'description' => 'the language you should choose',
    'value' => 'golang',
    'type' => 'select',
    'options' => [
        [
            'label' => 'PHP',
            'value' => 'php',
        ],
        [
            'label' => 'C++',
            'value' => 'cplusplus',
        ],
        [
            'label' => 'Go',
            'value' => 'golang',
        ]
    ]
];
```

![image](https://user-images.githubusercontent.com/1612364/117536674-06dc8980-b02f-11eb-9fdf-a4d3e7c6c1d2.png)

- `value` is required
- `type` should be `select`
- `options` is same with the `<option/>` tag in `<select/>` 

### `checkbox` field

example:

```php
$form_is_admin = [
    'label' => 'Is Admin',
    'description' => 'the user is admin or not',
    'value' => false,
    'type' => 'checkbox',
]
```

![image](https://user-images.githubusercontent.com/1612364/117536736-6f2b6b00-b02f-11eb-80f4-c56ad694363a.png)

- `value` is required, and must be `true` or `false`
- `type` should be `checkbox`

## Prefix

the default prefix is `form_`, and you can also define yours in the VScode `setinggs`

![image](https://user-images.githubusercontent.com/1612364/117541243-8b3a0700-b045-11eb-8a18-e66a2cb6cc1d.png)
