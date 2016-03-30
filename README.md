#  jQuery dropdown plugin

This plugin will make selects into nicer dropdown menus with classes and
stuff.

##  HTML usage

###  No subtext

```html
<form>
  <fieldset>
    <select class="catch-dropdown other-class" data-label="Selection"
      data-placeholder="Please select one" name="select-name"
      data-error="false" allow-empty="true">
        <option value="option 1">Option 1</option>
        <option value="option 2">allowoption 2</option>
    </select>
  </fieldset>
</form>
```

###  Global subtext - constant across all menu items

```html
<form>
  <fieldset>
    <select class="catch-dropdown other-class" data-label="Selection"
      data-subtext="subtext"
      data-placeholder="Please select one" name="select-name"
      data-error="false" allow-empty="true">
        <option value="option 1">Option 1</option>
        <option value="option 2">allowoption 2</option>
    </select>
  </fieldset>
</form>
```

###  Individual subtexts - one per menu item

```html
<form>
  <fieldset>
    <select class="catch-dropdown other-class" data-label="Selection"
      data-placeholder="Please select one" name="select-name"
      data-error="false" allow-empty="true">
        <option data-subtext="subtext1" value="option 1">Option 1</option>
        <option data-subtext="subtext2" value="option 2">allowoption 2</option>
    </select>
  </fieldset>
</form>
```

##  JS usage

```javascript
$('.catch-dropdown').catchDropdown();
```
