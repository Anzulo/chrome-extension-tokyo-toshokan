var urlRoot = 'http://tokyotosho.info/';
var urlIndex = urlRoot + 'index.php';
var urlSearch = urlRoot + 'search.php';

var bIndex = false;

jQuery(document).ready(function($) {
	getDataFromIndex(function(data) {
		console.log('index', data);
	});
	getDataFromSearch('naruto', function (data) {
		console.log('search', data);
	});
});

// Data Generation Functions
function getDataFromIndex(callback) {
	bIndex = true;
	requestPageFrom(urlIndex, {}, callback);
}
function getDataFromSearch(querystring, callback) {
	bIndex = false;
	requestPageFrom(urlIndex, { terms: querystring }, callback);
}

function requestPageFrom(url, param, callback) {
	jQuery.get(url, param, function(data, textStatus, xhr) {
	  var table = $(data).find('.listing');
	  var data = convertTableToJson(table);
	  callback(data);
	});
}

function convertTableToJson(table) {
	var data = [];

	var $rows = $(table).find('tbody tr');

	// Modify Rows for Indexpage
	var endId = bIndex?$rows.length-2:$rows.length-1;

	for (var i = 1; i < endId; i+=2 ) {
		data.push(new getDataFromRow($rows[i], $rows[i+1]));
	};
	return data;
}

// The data is always split in 2 rows
function getDataFromRow(firstRow, secondRow) {
	var model = {};

	var $columns = combineColumns(firstRow, secondRow);
	if ($columns.length != 5) {
		console.error('TokyoTosho: Hey Column count is not 5. Something is odd! Maybe the mainpage changed.');
		console.error('Check this: ', $($columns).html())
	};

	for (var i = 0; i < $columns.length; i++) {
		var $col = $($columns[i]);
		switch(i) {
			default: break;
			case 0: //Image Column - not very interessting
				break;
			case 1: //Magnet and Nyaa torrent link
				model.magnet = $($col.find('a')[0]).attr('href');
				model.nyaa = $($col.find('a')[1]).attr('href');
				model.name = $($col.find('a')[1]).text();
				break;
			case 2:
				model.detail = $col.find('a').first().attr('href');
				break;
			case 3:
				model.description = $($col).text();
				break;
			case 4:
				model.stats = $($col).text();
				break;
		}
	};

	return model;
}

function combineColumns(firstRow, secondRow) {
	var allColumns = [];
	var $columns1 = $(firstRow).find('td');
	var $columns2 = $(secondRow).find('td');

	for (var i = 0; i < $columns1.length; i++) {
		allColumns.push($columns1[i]);
	};
	for (var i = 0; i < $columns2.length; i++) {
		allColumns.push($columns2[i]);
	};
	return allColumns;
}


var TokyoToshoRequest = function() {

}