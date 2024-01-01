function fetchDataAndUpdateChart2() {
    fetch('/get-datachart2')
      .then(response => response.json())
      .then(data => {
        updateChart2(data);
      })
      .catch(error => console.error('Error:', error));
  }
  
function updateChart2(data) {
    am5.ready(function() {

        // Create root element
        // https://www.amcharts.com/docs/v5/getting-started/#Root_element
        var root = am5.Root.new("chart2div");
        
        
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
          wheelX: "panX",
          wheelY: "zoomX",
          paddingLeft:0,
          layout: root.verticalLayout
        }));
        
        
        var legend = chart.children.push(am5.Legend.new(root, {
          centerX: am5.p50,
          x: am5.p50,
        }))
        
        legend.labels.template.set("fill", am5.color("#ffffff"));

        chart.children.unshift(am5.Label.new(root, {
            text: "Top 5 Rated Games and Their Reviews",
            fontSize: 20,
            fontWeight: "500",
            textAlign: "center",
            x: am5.percent(50),
            centerX: am5.percent(50),
            paddingTop: 0,
            paddingBottom: 0,
            fill: am5.color("#ffffff") 
          }));
        
        // Create axes
        // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
        var yAxis = chart.yAxes.push(am5xy.CategoryAxis.new(root, {
            categoryField: "game",
            renderer: am5xy.AxisRendererY.new(root, {
                inversed: true,
                cellStartLocation: 0.1,
                cellEndLocation: 0.9,
                minorGridEnabled: true,
                labels: am5.Label.new(root, {
                    text: "{game} {rating}",
                    fontSize: 12, // Set the desired font size for Y-axis labels
                })
            })
        }));

        let yRenderer = yAxis.get("renderer");
        yRenderer.labels.template.setAll({
          fill: am5.color("#ffffff"),
          fontSize: "0.8em"
        });

        yAxis.data.setAll(data);
        
        var xAxis = chart.xAxes.push(am5xy.ValueAxis.new(root, {
          renderer: am5xy.AxisRendererX.new(root, {
            strokeOpacity: 0.1,
            minGridDistance: 50
          }),
          min: 0,
          labels: am5.Label.new(root, {
            fontSize: 12, // Set the desired font size for Y-axis labels
            fill: am5.color("#ffffff") 
        })
        }));

        let xRenderer = xAxis.get("renderer");
        xRenderer.labels.template.setAll({
          fill: am5.color("#ffffff"),
          fontSize: "0.8em"

        });
        
        
        // Add series
        // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
        function createSeries(field, name,color) {
          var series = chart.series.push(am5xy.ColumnSeries.new(root, {
            name: name,
            xAxis: xAxis,
            yAxis: yAxis,
            valueXField: field,
            categoryYField: "game",
            sequencedInterpolation: true,
            fill:color,
            tooltip: am5.Tooltip.new(root, {
              autoTextColor: false,
              pointerOrientation: "horizontal",
              labelText: "Rating: {rating}\n[bold]{name}[/]\n{categoryY}: {valueX}",
              fill: am5.color("#ffffff") 
            })
          }));
        
          series.columns.template.setAll({
            height: am5.p100,
            strokeOpacity: 0,
          });
        
        
          series.bullets.push(function () {
            return am5.Bullet.new(root, {
              locationX: 1,
              locationY: 0.5,
              fill: am5.color("#ffffff") ,
              sprite: am5.Label.new(root, {
                centerY: am5.p50,
                text: "{valueX}",
                populateText: true,
                fill: am5.color("#ffffff") 
              })
            });
          });
        
          series.bullets.push(function () {
            return am5.Bullet.new(root, {
              locationX: 1,
              locationY: 0.5,
              fill: am5.color("#ffffff") ,
              sprite: am5.Label.new(root, {
                centerX: am5.p100,
                centerY: am5.p50,
                text: "{name}",
                fill: am5.color("#ffffff"),
                populateText: true
              })
            });
          });
        
          series.data.setAll(data);
          series.appear();
        
          return series;
        }
        
        createSeries('Positive Reviews', 'Positive Reviews',chart.get("colors").getIndex(3));
        createSeries('Negative Reviews', 'Negative Reviews',chart.get("colors").getIndex(1));
        

        legend.data.setAll(chart.series.values);
        
        
        // Add cursor
        // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
        var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
          behavior: "zoomY"
        }));
        cursor.lineY.set("forceHidden", true);
        cursor.lineX.set("forceHidden", true);
        
        
        // Make stuff animate on load
        // https://www.amcharts.com/docs/v5/concepts/animations/
        chart.appear(1000, 100);
        
        }); // end am5.ready()
  
  }

document.addEventListener('DOMContentLoaded', function() {
    fetchDataAndUpdateChart2();
  });