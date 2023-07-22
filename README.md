# Bootstrap Form Validation

Frontend UI form validation with Bootstrap or MDBootstrap. This library allows you to easily create form validation in your application.

## Usage

- Make sure JQuery is loaded in the DOM before this script.
- Load the script on the dom

```
<script src="bootstrap-form-validation.js"></script>
```

### Validation on Submit

```
<form data-validate-on-submit="true">...</form>
```

### Validation on Blur

```
<form data-validate-on-blur="true">...</form>
```

### Manual Validation

```
<script>
    const validationResult = BootstrapValidation.process("#login-form");

    // Returns { errors: [], valid: true }

    if (validationResult.valid === false) {
        // Do some validation here
    }
</script>
```

## Types of Validation

Below are the types of validation this library can use so far.

### Required

Marks the input as required and will not accept a null or empty response.

```
data-validate-validation="required"
```

### Email

Marks the input as required valid address.

```
data-validate-validation="email"
```

### Minimum

Requires the input to be a minimum amount of characters.

```
data-validate-validation="min:5"
```

### Maximum

Requires the input to be equal to or less than a number of characters.

```
data-validate-validation="max:12"
```

## Multiple validations at once

You may run multiple validations on an input like so:

```
data-validate-validation="required|email"
```

## Simple Example

```
<form data-validate-on-submit="true" method="POST" action="">
    <div class="form-floating">
        <input data-validate-validation="required|email" name="email" type="text" class="form-control"
            id="floatingInput" placeholder="name@example.com">
        <label for="floatingInput">Email address</label>
    </div>
    <div class="form-floating">
        <input data-validate-validation="required|min:5|max:12" type="password" class="form-control"
            id="floatingPassword" placeholder="Password">
        <label for="floatingPassword">Password</label>
    </div>
    <button class="w-100 btn btn-lg btn-primary" type="submit">Sign in</button>
</form>
```