$(function() {
    Morris.Bar({
        element: 'morris-bar-chart',
        data: [{
            y: '2006',
            a: 100,
            b: 90,
            c: 80
        }, {
            y: '2007',
            a: 75,
            b: 65,
            c: 85
        }, {
            y: '2008',
            a: 50,
            b: 40,
            c: 65
        }, {
            y: '2009',
            a: 75,
            b: 65,
            c: 30
        }],
        
        
        xkey: 'y',
        ykeys: ['a', 'b', 'c'],
        labels: ['Temperature', 'Pressure', 'Humidity'],
        hideHover: 'auto',
        resize: true
    });
    
});
