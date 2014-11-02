#  jQuery dropdown plugin

This plugin will make selects into nicer dropdown menus with classes and
stuff.

##  HTML usage

```html
<form>
  <fieldset>
    <select class="catch-dropdown" data-label="Selection"
      data-placeholder="Please select one" name="select-name"
      data-error="false" allow-empty="true">
        <option value="option 1">Option 1</option>
        <option value="option 2">allowoption 2</option>
    </select>
  </fieldset>
</form>
```

##  JS usage

```javascript
$('.catch-dropdown').catchDropdown();
```
