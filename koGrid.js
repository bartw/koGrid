Element.prototype.createKoGrid = function (parameterObject) {
    if (parameterObject.hasOwnProperty("viewModel") &&
        parameterObject.hasOwnProperty("data") &&
        parameterObject.hasOwnProperty("columns")) {

        var subModelBase = "koGrid";
        var suffix = 1

        while (parameterObject.viewModel.hasOwnProperty(subModelBase + suffix.toString())) {
            suffix = suffix + 1;
        }

        var subModelName = subModelBase + suffix.toString();

        parameterObject.viewModel[subModelName] = new koGridViewModel(subModelName, parameterObject);

        this.innerHTML = parameterObject.viewModel[subModelName].getHtml();
    } else {
        throw new koGridException("incomplete parameters");
        return;
    }
}

function koGridViewModel(model, parameterObject) {
    var self = this;

    var columns = parameterObject.columns;
    var data = parameterObject.data;
    var allowDelete = true;

    self.sortBy = { prop: ko.observable(""), direction: ko.observable(0) };

    for (var i=0; i < columns.length; i++) {
        var column = columns[i];

        if (column.hasOwnProperty("prop")) {
            self[column.prop] = ko.observable("");
        }
    }

    self.sort = function (data, property) {
        var oldProp = self.sortBy.prop();
        self.sortBy.prop(property);

        if (self.sortBy.direction() == 0 || (oldProp != property) || self.sortBy.direction() == -1) {
            self.sortBy.direction(1);
        } else {
            self.sortBy.direction(-1);
        }

        sortData(data);
    }

    self.delete = function (data, index) {
        data.splice(index, 1);
    }

    self.add = function (data) {
        var newRow = new Object();

        for (var i=0; i < columns.length; i++) {
            var column = columns[i];

            if (column.hasOwnProperty("prop")) {
                newRow[column.prop] = ko.observable(self[column.prop]());
                self[column.prop]("");
            }
        }

        data.push(newRow);

        sortData(data);
    }

    self.getHtml = function () {
        var htmlString = "";

        //Create table
        htmlString += '<table class="koGrid"><tbody>';

        //Add header row
        htmlString += createHeaderRow();

        //Add content
        htmlString += createContentTemplate();

        //Add add row
        htmlString += createAddRow();

        htmlString += '</tbody></table>';

        return htmlString;
    }

    var createHeaderRow = function () {
        var headerRow = "";

        headerRow += '<tr class="koGridHeader">';
        for (var i=0; i < columns.length; i++) {
            var column = columns[i];

            if (column.hasOwnProperty("header")) {
                if (column.hasOwnProperty("prop")) {
                    headerRow += '<td>';
                    headerRow += '<a data-bind="click: ' + model + '.sort.bind($data, ' + data +', \'' + column.prop + '\')">' + column.header;
                    headerRow += '<span style="display: none" data-bind="visible: ' + model + '.sortBy.prop() == \'' + column.prop + '\' && ' + model + '.sortBy.direction() == 1">&#x25B2;</span>';
                    headerRow += '<span style="display: none" data-bind="visible: ' + model + '.sortBy.prop() == \'' + column.prop + '\' && ' + model + '.sortBy.direction() == -1">&#x25BC;</span>';
                    headerRow += '</td>';
                } else {
                    headerRow += "<td>" + column.header + "</td>";
                }

            }
        }
        headerRow += "</tr>";

        return headerRow;
    }

    var createContentTemplate = function () {
        var contentTemplate = "";

        contentTemplate += "<!-- ko foreach: " + data + " -->";

        contentTemplate += '<tr class="koGridContent">';
        for (var i=0; i < columns.length; i++) {
            var column = columns[i];

            if (column.hasOwnProperty("prop")) {
                if (column.hasOwnProperty("edit") && column.edit == false) {
                    contentTemplate += '<td data-bind="text: ' + column.prop + '"></td>';
                } else if (column.hasOwnProperty("binding")) {
                    contentTemplate += '<td><input data-bind="' + column.binding + ': ' + column.prop + '" /></td>';
                } else {
                    contentTemplate += '<td><input data-bind="value: ' + column.prop + '" /></td>';
                }
            }
        }
        if (allowDelete) {
            contentTemplate += '<td class="koGridDelete"><a data-bind="click: $parent.' + model + '.delete.bind($data, $parent[\'' + data + '\'], $index())">Delete</a></td>';
        }
        contentTemplate += "</tr>";

        contentTemplate += "<!-- /ko -->";

        return contentTemplate;
    }

    var createAddRow = function() {
        var addRow = "";

        addRow += '<tr class="koGridAdd">';

        for (var i=0; i < columns.length; i++) {
            var column = columns[i];
            addRow += '<td><input data-bind="value: ' + model + '.' + column.prop + '" /></td>';
        }

        addRow += '<td class="koGridAddLink"><a data-bind="click: ' + model + '.add.bind($data, ' + data + ')">Add</a></td>';

        addRow += "</tr>";

        return addRow;
    }

    var sortData = function (data) {
        if (self.sortBy.prop().length > 0 && self.sortBy.direction() != 0) {
            var property = self.sortBy.prop();

            if (self.sortBy.direction() == 1) {
                data.sort(function(left, right) { return left[property]() == right[property]() ? 0 : (left[property]() < right[property]() ? -1 : 1) });
            } else {
                data.sort(function(left, right) { return left[property]() == right[property]() ? 0 : (left[property]() < right[property]() ? 1 : -1) });
            }
        }
    }
}

function koGridException(message) {
    this.message = message;
    this.name = "koGridException";
}