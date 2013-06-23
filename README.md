# [koGrid](http://github.com/bartw/koGrid)

koGrid is a basic crud grid that can be generated from a [knockoutjs](http://knockoutjs.com/) observable array.
koGrid is created and maintained by [Bart Wijnants](https://twitter.com/BartWijnants)

##Getting Started
```javascript

var target = document.getElementById("target");

target.createKoGrid({
    viewModel: yourViewModel,
    data: "yourObservableArray",
    columns: [
        {
            prop: "yourProperty",
            header: "yourPropertyHeader",
            edit: false
        },
        {
            prop: "yourOtherProperty",
            header: "yourOtherPropertyHeader"
        }
    ]
});

```