function fetchDataAndUpdateChart4() {
    fetch('/get-datachart4')
      .then(response => response.json())
      .then(data => {
        updateChart4(data);
      })
      .catch(error => console.error('Error:', error));
  }
  
function updateChart4(data) {

    am5.ready(function() {

        // Create root element
        // https://www.amcharts.com/docs/v5/getting-started/#Root_element
        var root = am5.Root.new("chart4div");
        
        
        // Set themes
        // https://www.amcharts.com/docs/v5/concepts/themes/
        root.setThemes([
          am5themes_Animated.new(root)
        ]);
        

        
        // Create chart
        // https://www.amcharts.com/docs/v5/charts/xy-chart/
        var chart = root.container.children.push(am5xy.XYChart.new(root, {
          panX: true,
          panY: true,
          wheelY: "zoomXY",
          pinchZoomX:true,
          pinchZoomY:true
        }));

        var titleLabel = am5.Label.new(root, {
          text: "All Games With Their Reviews and Ratings",
          fontSize: 20,
          fontWeight: "500",
          textAlign: "center",
          x: am5.percent(50),
          centerX: am5.percent(50),
          paddingTop: 0,
          paddingBottom: 0,
          fill: am5.color("#ffffff") 
        });

        titleLabel.set("y", 0);
        chart.children.unshift(titleLabel);
        
        
        // Create axes
        // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
        var xAxis = chart.xAxes.push(am5xy.ValueAxis.new(root, {
          renderer: am5xy.AxisRendererX.new(root, {}),
          tooltip: am5.Tooltip.new(root, {})
        }));
        
        xAxis.children.moveValue(am5.Label.new(root, {
          text: "Negative Reviews",
          x: am5.p50,
          centerX: am5.p50,
          fill: am5.color("#ffffff")
        }), xAxis.children.length - 1);

        
        
        var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
          renderer: am5xy.AxisRendererY.new(root, {
            inversed: false
          }),
          tooltip: am5.Tooltip.new(root, {})
        }));
        
        yAxis.children.moveValue(am5.Label.new(root, {
          rotation: -90,
          text: "Positive Reviews",
          y: am5.p50,
          centerX: am5.p50,
          fill: am5.color("#ffffff")
        }), 0);

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
        
        
        // Create series
        // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
        var series = chart.series.push(am5xy.LineSeries.new(root, {
          calculateAggregates: true,
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: "Positive Reviews",
          valueXField: "Negative Reviews",
          valueField: "Rating",
          seriesTooltipTarget:"bullet",
          tooltip: am5.Tooltip.new(root, {
            pointerOrientation: "horizontal",
            labelText: "[bold]{Game}[/]\nPositive Reviews: {valueY.formatNumber('#.0')}\nNegative Reviews: {valueX.formatNumber('#,###.')}\nRating: {value.formatNumber('#,###.')}"
          })
        }));
        
        series.strokes.template.set("visible", false);
        
        
        // Add bullet
        // https://www.amcharts.com/docs/v5/charts/xy-chart/series/#Bullets
        var circleTemplate = am5.Template.new({});
        circleTemplate.adapters.add("fill", function(fill, target) {
          var dataItem = target.dataItem;
          if (dataItem) {
            return am5.Color.fromString(dataItem.dataContext.color);
          }
          return fill
        });
        series.bullets.push(function() {
          var bulletCircle = am5.Circle.new(root, {
            radius: 2.5,
            fill: series.get("fill"),
            fillOpacity: 0.8
          }, circleTemplate);
          return am5.Bullet.new(root, {
            sprite: bulletCircle
          });
        });
        
        
        // Add heat rule
        // https://www.amcharts.com/docs/v5/concepts/settings/heat-rules/
        series.set("heatRules", [{
          target: circleTemplate,
          min: 1,
          max: 7,
          dataField: "value",
          key: "radius"
        }]);
        chart.set("cursor", am5xy.XYCursor.new(root, {
            xAxis: xAxis,
            yAxis: yAxis,
            snapToSeries: [series]
          }));
          
          
          // Add scrollbars
          // https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
          chart.set("scrollbarX", am5.Scrollbar.new(root, {
            orientation: "horizontal"
          }));
          // chart.get("scrollbarX").set("paddingTop", 30);
          
          chart.set("scrollbarY", am5.Scrollbar.new(root, {
            orientation: "vertical"
          }));
          
          series.data.setAll(data);
          // Make stuff animate on load
          // https://www.amcharts.com/docs/v5/concepts/animations/
          series.appear(1000);
          chart.appear(1000, 100);
          
          }); // end am5.ready()

  }

document.addEventListener('DOMContentLoaded', function() {
    fetchDataAndUpdateChart4();
  });