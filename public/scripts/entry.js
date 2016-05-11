var React = require('react');
var ReactDOM = require('react-dom');
var Dropzone = require('react-dropzone');
var Highcharts = require('highcharts');
var ReactBSTable = require('react-bootstrap-table');
var BootstrapTable = ReactBSTable.BootstrapTable;
var TableHeaderColumn = ReactBSTable.TableHeaderColumn;
var $ = require('jquery');;

require('highcharts/modules/exporting')(Highcharts);

var dataOptions = {
  chart: {
    type: 'scatter',
    zoomType: 'xy'
  },
  title: {
    text: 'sctter plot'
  },
  subtitle: {
    text: 'movie.json'
  },
  xAxis: {
    title: {
      enabled: true,
      text: 'vote_average'
    },
    startOnTick: true,
    endOnTick: true,
    showLastLabel: true
  },
  yAxis: {
    title: {
      text: 'vote_count'
    }
  },
  legend: {
    layout: 'vertical',
    align: 'left',
    verticalAlign: 'top',
    x: 100,
    y: 70,
    floating: true,
    backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF',
    borderWidth: 1
  },
  plotOptions: {
    scatter: {
      marker: {
        radius: 5,
        states: {
          hover: {
            enabled: true,
            lineColor: 'rgb(100,100,100)'
          }
        }
      },
      states: {
        hover: {
          marker: {
            enabled: false
          }
        }
      },
      tooltip: {
        headerFormat: '<b>{series.name}</b><br>',
        pointFormat: '{point.x} , {point.y} '
      }
    }
  },
  series: [{
    name: 'rate',
    color: 'rgba(223, 83, 83, .5)'
  }]

};

//////////////
var MovieBox = React.createClass({
  loadMoviesFromServer: function() {

    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        $("#err").hide();
        this.setState({
          data: data
        });

        //report
        var arrayLength = data.movies.length;
        var newData = new Array();
        for (var i = 0; i < arrayLength; i++) {
          var tmp = new Array();

          tmp.push(parseInt(data.movies[i]['vote_average']));
          tmp.push(parseInt(data.movies[i]['vote_count']));
          //Do something
          newData.push(tmp);
        }
        dataOptions['series'][0]['data'] = newData;
        console.log(dataOptions);
        draw();
        //var chart = Highcharts.chart(document.getElementById('chart'), dataOptions);
      }.bind(this),
      error: function(xhr, status, err) {
        $("#err").show();
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleMovieSubmit: function() {
    var movies = this.state.data;

    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: movies,
      success: function(data) {
        $("#err").hide();

        this.setState({
          data: data
        });
      }.bind(this),
      error: function(xhr, status, err) {
        this.setState({
          data: movies
        });
        $("#err").show();
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    url = this.props.url;
    return {
      data: {
        "movies": [{
          "backdrop_path": "/gmLMaDXi4lFWG8WitaCYOJS5GtL.jpg",
          "id": 1,
          "original_title": "Star Wars: The Clone Wars",
          "release_date": "2008-08-15",
          "poster_path": "http://image.tmdb.org/t/p/w300/xd6yhmtS6mEURZLwUDT5raEMbf.jpg",
          "title": "Star Wars: The Clone Wars",
          "vote_average": 7.7,
          "vote_count": 12
        }]
      }
    };
  },
  componentDidMount: function() {
    this.loadMoviesFromServer();
    setInterval(this.loadMoviesFromServer, this.props.pollInterval);
  },
  options: (function() {
    var res = {};
    res['handleConfirmDeleteRow'] = function(exeDelete, key) {
      exeDelete();
    };
    res['noDataText'] = "No Data";
    return res;
  }()),

  selectRowProp: {
    mode: "radio",
    clickToSelect: true,
    bgColor: "rgb(238, 193, 213)",
    onSelect: onRowSelect
  },
  deleteEle: function(index) {
    this.refs.table.handleDropRow([index + 1]);
    var cache = this.state.data.movies.slice(index + 1);
    this.setState({
      data: {
        movies: cache
      }
    });
    this.state.data.movies = this.state.data.movies.slice(index + 1);
    //console.log(this.state.data.movies.slice(index + 1).length);
    console.log(this.state.data.movies.length);
    this.handleMovieSubmit();
  },
  actionFormatter: function(cell, row) {
    return ( < DeleteBtn cell = {
          cell
        }
        data = {
          this.state.data
        }
        functor = {
          this.deleteEle
        }
        />);
      },
      handleSubmit: function(e) {
        //e.preventDefault();
      },

      handleFile: function(e) {
        var self = this;
        var reader = new FileReader();
        var file = e.target.files[0];

        reader.onload = function(upload) {
          //this.setState({data: reader.result});
          //this.handleMovieSubmit();
          $.ajax({
            url: "/api/movies",
            dataType: 'json',
            type: 'POST',
            data: reader.result,
            success: function(data) {
              $("#err").hide();

              //this.setState({data: data});
            }.bind(this),
            error: function(xhr, status, err) {
              //this.setState(reader.result);
              $("#err").show();
              console.error(this.props.url, status, err.toString());
            }.bind(this)
          });
          console.log(this);
          console.log(file);
          console.log(upload);
        };
        reader.readAsBinaryString(file);

      },
	  render: function() {	  
		return (
			<div>
				<div id="err" className="alert alert-danger">opps, error occur</div>
				<BootstrapTable data={this.state.data.movies} striped={true} hover={true} options={this.options}  ref='table'>
					 <TableHeaderColumn dataField="id" isKey={true} dataAlign="center" width="50%" dataSort={true}>ID</TableHeaderColumn>
					 <TableHeaderColumn dataField="poster_path" dataAlign="center" dataFormat={postFormatter}>Poster</TableHeaderColumn>	
					 <TableHeaderColumn dataField="title" dataAlign="center" dataSort={true}>Movie Name</TableHeaderColumn>
					 <TableHeaderColumn dataField="release_date" dataAlign="center" dataSort={true}>Release Date</TableHeaderColumn>
					 <TableHeaderColumn dataField="vote_average" dataAlign="center" dataSort={true}>Vote Average</TableHeaderColumn>
					 <TableHeaderColumn dataField="vote_count" dataAlign="center" dataSort={true}>Vote Count</TableHeaderColumn>
					 <TableHeaderColumn dataField="id" dataAlign="center" dataFormat={this.actionFormatter} ref='action'>Action</TableHeaderColumn>  			 
				</BootstrapTable>
			</div>
		);
  }
});

var DeleteBtn = React.createClass({
  handleClick: function(cell, functor) {
    functor(cell - 1);
  },
  render: function() {
    return ( < a className = "pointer"
      onClick = {
        this.handleClick.bind(this, this.props.cell, this.props.functor)
      } > < i className = "material-icons" > delete_forever < /i>Delete</a >
    );
  }
});

function draw() {
  Highcharts.chart(document.getElementById('chart'), dataOptions);
}

function onRowSelect(cell, row) {

}

function postFormatter(cell, row) {
  return '<img class="poster shadowed" height="209" width="140" alt="Movie Poster" title="Movie Poster" src="' + cell + '" itemprop="image">';
}

function priceFormatter(cell, row) {
  return '<i class="glyphicon glyphicon-usd"></i> ' + cell;
}
var url;
ReactDOM.render( < MovieBox url = "/api/movies"
  pollInterval = {
    60000
  }
  />,
  document.getElementById('container')
);

//////////////////////////////////////////
//var DropzoneDemo = React.createClass({
//    onDrop: function (files) {
//      console.log('Received files: ', files);
//    },
//
//    render: function () {
//      return (
//          <div>
//            <Dropzone onDrop={this.onDrop}>
//              <div>Try dropping some files here, or click to select files to upload.</div>
//            </Dropzone>
//          </div>
//      );
//    }
//});
//
//ReactDOM.render(<DropzoneDemo />, document.getElementById('upload'));

//////////////////////////////
//var FileForm = React.createClass({
//  // since we are starting off without any data, there is no initial value
//  getInitialState: function() {
//    return {
//      data_uri: null,
//    };
//  },
//
//  // prevent form from submitting; we are going to capture the file contents
//  handleSubmit: function(e) {
//    e.preventDefault();
//  },
//
//  handleFile: function(e) {
//    var self = this;
//    var reader = new FileReader();
//    var file = e.target.files[0];
//
//    reader.onload = function(upload) {
//		$.ajax({
//		  url: '/api/movies',
//		  dataType: 'json',
//		  type: 'POST',
//		  data: reader.result,
//		  success: function(data) {
//			$("#err").hide();	
//		
//			this.setState({data: data});
//		  }.bind(this),
//		  error: function(xhr, status, err) {
//			//this.setState({data: movies});
//			$("#err").show();
//			console.error('/api/movies', status, err.toString());
//		  }.bind(this)
//		});
//      console.log(reader.result.substring(0, 200));
//    };
//    reader.readAsText(file);
//
//  },
//
//  // return the structure to display and bind the onChange, onSubmit handlers
//  render: function() {
//    // since JSX is case sensitive, be sure to use 'encType'
//    return (
//      <form onSubmit={this.handleSubmit} encType="multipart/form-data">
//        <input type="file" onChange={this.handleFile} />
//      </form>
//    );
//  },
//});
//ReactDOM.render(<FileForm />, document.getElementById('main2'));


//////////////////////////////
//var Avatar = React.createClass({
//  render: function() {
//    return (
//      <div>
//        <PagePic pagename={this.props.pagename} />
//        <PageLink pagename={this.props.pagename} />
//      </div>
//    );
//  }
//});
//
//var PagePic = React.createClass({
//  render: function() {
//    return (
//      <img src={'https://graph.facebook.com/' + this.props.pagename + '/picture'} />
//    );
//  }
//});
//
//var PageLink = React.createClass({
//  render: function() {
//    return (
//      <a href={'https://www.facebook.com/' + this.props.pagename}>
//        {this.props.pagename}
//      </a>
//    );
//  }
//});
//
//ReactDOM.render(
//  <Avatar pagename="Engineering" />,
//  document.getElementById('example')
//);

//var products = [{
//      id: 1,
//      name: "Item name 1",
//      price: 100,
//	  original_title: '1'
//  },{
//      id: 2,
//      name: "Item name 2",
//      price: 100,
//	  original_title: '2'
//  }];
//ReactDOM.render(
//		 <BootstrapTable data={movie} striped={true} hover={true}>
//			 <TableHeaderColumn dataField="id" isKey={true} dataAlign="center" dataSort={true}>Product ID</TableHeaderColumn>
//			 <TableHeaderColumn dataField="title" dataSort={true}>Movie Name</TableHeaderColumn>
//			 <TableHeaderColumn dataField="vote_average" dataFormat={priceFormatter}>Vote Average</TableHeaderColumn>
//			 <TableHeaderColumn dataField="vote_count">Vote Count</TableHeaderColumn>
//		 </BootstrapTable>,
//    document.getElementById("main")
//);
//ReactDOM.render(
//  <BootstrapTable data={products} striped={true} hover={true}>
//      <TableHeaderColumn dataField="id" isKey={true} dataAlign="center" dataSort={true}>Product ID</TableHeaderColumn>
//      <TableHeaderColumn dataField="name" dataSort={true}>Product Name</TableHeaderColumn>
//      <TableHeaderColumn dataField="price" dataFormat={priceFormatter}>Product Price</TableHeaderColumn>
//      <TableHeaderColumn dataField="original_title">Original Title</TableHeaderColumn>
//  </BootstrapTable>,
//    document.getElementById("main")
//);
