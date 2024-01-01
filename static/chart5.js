function fetchDataAndUpdateChart5() {
    fetch('/get-datachart5')
      .then(response => response.json())
      .then(data => {
        updateChart5(data);
      })
      .catch(error => console.error('Error:', error));
  }
  
function updateChart5(data) {

    am5.ready(function() {

        // Create root element
        // https://www.amcharts.com/docs/v5/getting-started/#Root_element
        var root = am5.Root.new("chart5div");
        
        
        // Set themes
        // https://www.amcharts.com/docs/v5/concepts/themes/
        root.setThemes([
          am5themes_Animated.new(root)
        ]);
        
        // Create chart
        // https://www.amcharts.com/docs/v5/charts/xy-chart/
        var chart = root.container.children.push(am5xy.XYChart.new(root, {
          panX: false,
          panY: false,
          wheelX: "none",
          wheelY: "none",
          layout: root.horizontalLayout,
          paddingLeft: 0,
          title: am5.Label.new(root, {
            text: "Most Popular Genres in the Past 3 Years",
            fontSize: 18,
            fontWeight: "bold",
            fill: am5.color("#ffffff"),
            marginBottom: 10
          })
        }));

        // var titleLabel = am5.Label.new(root, {
        //   text: "Most Popular Genres in the Past 3 Years",
        //   fontSize: 20,
        //   fontWeight: "500",
        //   textAlign: "center",
        //   x: am5.percent(50),
        //   centerX: am5.percent(50),
        //   paddingTop: 0,
        //   paddingBottom: 0,
        //   fill: am5.color("#ffffff") 
        // });

        // titleLabel.set("y", 0);
        // chart.children.unshift(titleLabel);

        // chart.children.unshift(am5.Label.new(root, {
        //     text: "Most Popular Genres in the Past 3 Years",
        //     fontSize: 15,
        //     fontWeight: "500",
        //     textAlign: "center",
        //     x: am5.percent(50),
        //     centerX: am5.percent(50),
        //     paddingTop: -10,
        //     paddingBottom: 0,
        //     fill: am5.color("#ffffff") 
        //   }));
        
        // Add legend
        // https://www.amcharts.com/docs/v5/charts/xy-chart/legend-xy-series/
        var legendData = [];
        var legend = chart.children.push(
          am5.Legend.new(root, {
            nameField: "name",
            fillField: "color",
            strokeField: "color",
            //centerY: am5.p50,
            marginLeft: 20,
            y: 20,
            layout: root.verticalLayout,
            clickTarget: "none"
          })
        );
        legend.labels.template.set("fill", am5.color("#ffffff"));

        
        // Create axes
        // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
        var yAxis = chart.yAxes.push(am5xy.CategoryAxis.new(root, {
          categoryField: "primary_genre",
          renderer: am5xy.AxisRendererY.new(root, {
            minGridDistance: 10,
            minorGridEnabled: true
          }),
          tooltip: am5.Tooltip.new(root, {}),
          sortOrder: "descending"
        }));
        
        yAxis.get("renderer").labels.template.setAll({
          fontSize: 12,
          location: 0.5
        })
        
        yAxis.data.setAll(data);
        
        var xAxis = chart.xAxes.push(am5xy.ValueAxis.new(root, {
          renderer: am5xy.AxisRendererX.new(root, {}),
          tooltip: am5.Tooltip.new(root, {})
        }));
        
        let xRenderer = xAxis.get("renderer");
        xRenderer.labels.template.setAll({
          fill: am5.color("#ffffff"),
          fontSize: "0.8em"
        });
        
        let yRenderer = yAxis.get("renderer");
        yRenderer.labels.template.setAll({
          fill: am5.color("#ffffff"),
          fontSize: "0.8em"

        });
        // Add series
        // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
        var series = chart.series.push(am5xy.ColumnSeries.new(root, {
          xAxis: xAxis,
          yAxis: yAxis,
          valueXField: "players_right_now",
          categoryYField: "primary_genre",
          tooltip: am5.Tooltip.new(root, {
            pointerOrientation: "horizontal"
          })
        }));
        
        series.columns.template.setAll({
          tooltipText: "{categoryY}: [bold]{valueX}[/]",
          width: am5.percent(90),
          strokeOpacity: 0
        });
        
        series.columns.template.adapters.add("fill", function(fill, target) {
          if (target.dataItem) {
            switch(target.dataItem.dataContext.years) {
              case "2021":
                return chart.get("colors").getIndex(1);
                break;
              case "2022":
                return chart.get("colors").getIndex(2);
                break;
              case "2023":
                return chart.get("colors").getIndex(3);
                break;
            }
          }
          return fill;
        })
        
        series.data.setAll(data);
        
        function createRange(label, category, color) {
          var rangeDataItem = yAxis.makeDataItem({
            category: category
          });
          
          var range = yAxis.createAxisRange(rangeDataItem);
          
          rangeDataItem.get("label").setAll({
            fill: color,
            text: label,
            location: 1,
            fontWeight: "bold",
            dx: -130
          });
        
          rangeDataItem.get("grid").setAll({
            stroke: color,
            strokeOpacity: 1,
            location: 1
          });
          
          rangeDataItem.get("tick").setAll({
            stroke: color,
            strokeOpacity: 1,
            location: 1,
            visible: true,
            length: 130
          });
          
          legendData.push({ name: label, color: color });
          
        }
        
        createRange("2021", "Indie(21)", chart.get("colors").getIndex(1));
        createRange("2022", "Adventure(22)", chart.get("colors").getIndex(2));
        createRange("2023", "RPG(23)", chart.get("colors").getIndex(3));
        
        legend.data.setAll(legendData);
        
        
        // Add cursor
        // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
        var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
          xAxis: xAxis,
          yAxis: yAxis
        }));
        
        
        // Make stuff animate on load
        // https://www.amcharts.com/docs/v5/concepts/animations/
        series.appear();
        chart.appear(1000, 100);
        
        }); // end am5.ready()

  }

document.addEventListener('DOMContentLoaded', function() {
    fetchDataAndUpdateChart5();
  });