// Morris.js Charts sample data for SB Admin template

$(function() {

    // Area Chart
    Morris.Area({
        element: 'morris-area-chart',
        data: [{
            period: '2015 Q1',
            motion: 1,
            temperature: 0,
            humidity: 1
        }, {
            period: '2015 Q2',
            motion: 2,
            temperature: 1,
            humidity: 2
        }, {
            period: '2015 Q3',
            motion: 1,
            temperature: 1,
            humidity: 1
        }, {
            period: '2015 Q4',
            motion: 2,
            temperature: 1,
            humidity: 0
        }, {
            period: '2016 Q1',
            motion: 1,
            temperature: 1,
            humidity: 3
        }, {
            period: '2016 Q2',
            motion: 5,
            temperature: 6,
            humidity: 5
        }, {
            period: '2016 Q3',
            motion: 7,
            temperature: 5,
            humidity: 4
        }, {
            period: '2016 Q4',
            motion: 1,
            temperature: 1,
            humidity: 0
        }],
        xkey: 'period',
        ykeys: ['motion', 'temperature', 'humidity'],
        labels: ['motion', 'temperature', 'humidity'],
        pointSize: 2,
        hideHover: 'auto',
        resize: true
    });

    // Donut Chart
    Morris.Donut({
        element: 'morris-donut-chart',
        data: [{
            label: "Download Sales",
            value: 12
        }, {
            label: "In-Store Sales",
            value: 30
        }, {
            label: "Mail-Order Sales",
            value: 20
        }],
        resize: true
    });

    // Line Chart
    Morris.Line({
        // ID of the element in which to draw the chart.
        element: 'morris-line-chart',
        // Chart data records -- each entry in this array corresponds to a point on
        // the chart.
        data: [{
            d: '2012-10-01',
            visits: 80
        }, {
            d: '2012-10-02',
            visits: 78
        }, {
            d: '2012-10-03',
            visits: 82
        }, {
            d: '2012-10-04',
            visits: 83
        }, {
            d: '2012-10-05',
            visits: 79
        }, {
            d: '2012-10-06',
            visits: 85
        }, {
            d: '2012-10-07',
            visits: 79
        }, {
            d: '2012-10-08',
            visits: 168
        }, {
            d: '2012-10-09',
            visits: 159
        }, {
            d: '2012-10-10',
            visits: 142
        }, {
            d: '2012-10-11',
            visits: 88
        }, {
            d: '2012-10-12',
            visits: 88
        }, {
            d: '2012-10-13',
            visits: 81
        }, {
            d: '2012-10-14',
            visits: 84
        }, {
            d: '2012-10-15',
            visits: 87
        }, {
            d: '2012-10-16',
            visits: 106
        }, {
            d: '2012-10-17',
            visits: 119
        }, {
            d: '2012-10-18',
            visits: 122
        }, {
            d: '2012-10-19',
            visits: 132
        }, {
            d: '2012-10-20',
            visits: 132
        }, {
            d: '2012-10-21',
            visits: 123
        }, {
            d: '2012-10-22',
            visits: 119
        }, {
            d: '2012-10-23',
            visits: 131
        }, {
            d: '2012-10-24',
            visits: 129
        }, {
            d: '2012-10-25',
            visits: 128
        }, {
            d: '2012-10-26',
            visits: 124
        }, {
            d: '2012-10-27',
            visits: 132
        }, {
            d: '2012-10-28',
            visits: 139
        }, {
            d: '2012-10-29',
            visits: 142
        }, {
            d: '2012-10-30',
            visits: 152
        }, {
            d: '2012-10-31',
            visits: 189
        }, ],
        // The name of the data record attribute that contains x-visitss.
        xkey: 'd',
        // A list of names of data record attributes that contain y-visitss.
        ykeys: ['visits'],
        // Labels for the ykeys -- will be displayed when you hover over the
        // chart.
        labels: ['Visits'],
        // Disables line smoothing
        smooth: false,
        resize: true
    });

    // Bar Chart
    Morris.Bar({
        element: 'morris-bar-chart',
        data: [{
            device: 'motion',
            geekbench: 136
        }, {
            device: 'motion 3G',
            geekbench: 137
        }, {
            device: 'motion 3GS',
            geekbench: 275
        }, {
            device: 'motion 4',
            geekbench: 380
        }, {
            device: 'motion 4S',
            geekbench: 655
        }, {
            device: 'motion 5',
            geekbench: 1571
        }],
        xkey: 'device',
        ykeys: ['geekbench'],
        labels: ['Geekbench'],
        barRatio: 0.4,
        xLabelAngle: 35,
        hideHover: 'auto',
        resize: true
    });


});
