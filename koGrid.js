Element.prototype.createKoGrid = function(parameterObject) {
    var htmlString = "";

    if (parameterObject.hasOwnProperty("viewModel")) {
        parameterObject.viewModel["koGridSortBy"] = { prop: ko.observable(""), direction: ko.observable("") };

        if (parameterObject.hasOwnProperty("data") && parameterObject.hasOwnProperty("columns")) {
            //Create table
            htmlString += '<table><tbody>';

            //Add header row
            htmlString += createHeaderRow(parameterObject.data, parameterObject.columns);

            //Add content
            var allowDelete = true;
            if (parameterObject.hasOwnProperty("delete") && parameterObject.delete == false) {
                allowDelete = false;
            }

            htmlString += createContentTemplate(parameterObject.data, parameterObject.columns, allowDelete);

            htmlString += '</tbody></table>';
        }
    }

    this.innerHTML = htmlString;
}

function createHeaderRow(data, columns) {
    var headerRow = "";

    headerRow += "<tr>";
    for (var i=0; i < columns.length; i++)
    {
        var column = columns[i];

        if (column.hasOwnProperty("header")) {
            if (column.hasOwnProperty("prop")) {
                headerRow += '<td>';
                headerRow += '<a data-bind="click: koGridSort.bind($data, ' + data +', \'' + column.prop + '\')">' + column.header;
                headerRow += '<span style="display: none" data-bind="visible: koGridSortBy.prop() == \'' + column.prop + '\' && koGridSortBy.direction() == \'up\'">&#x25B2;</span>';
                headerRow += '<span style="display: none" data-bind="visible: koGridSortBy.prop() == \'' + column.prop + '\' && koGridSortBy.direction() == \'down\'">&#x25BC;</span>';
                headerRow += '</td>';
            } else {
                headerRow += "<td>" + column.header + "</td>";
            }

        }
    }
    headerRow += "</tr>";

    return headerRow;
}

function createContentTemplate(data, columns, allowDelete) {
    var contentTemplate = "";

    contentTemplate += "<!-- ko foreach: " + data + " -->";

    contentTemplate += "<tr>";
    for (var i=0; i < columns.length; i++)
    {
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
        contentTemplate += '<td><a data-bind="click: koGridDelete.bind($data, $parent[\'' + data + '\'], $index())">Delete</a></td>';
    }
    contentTemplate += "</tr>";

    contentTemplate += "<!-- /ko -->";

    return contentTemplate;
}

function koGridSort(data, property) {
    var oldProp = this.koGridSortBy.prop();
    this.koGridSortBy.prop(property);

    if (this.koGridSortBy.direction() == "" || (oldProp != property) || this.koGridSortBy.direction() == "down") {
        this.koGridSortBy.direction("up");
        data.sort(function(left, right) { return left[property]() == right[property]() ? 0 : (left[property]() < right[property]() ? -1 : 1) });
    } else {
        this.koGridSortBy.direction("down");
        data.sort(function(left, right) { return left[property]() == right[property]() ? 0 : (left[property]() < right[property]() ? 1 : -1) });
    }
}

function koGridDelete(data, index) {
    data.splice(index, 1);
}