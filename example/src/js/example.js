/**
 * Created by rlienard on 18/11/13.
 */

    var images = [
        {url:"src/img/picts/sakura/sakura001.jpg"},
        {url:"src/img/picts/sakura/sakura002.jpg"},
        {url:"src/img/picts/sakura/sakura003.jpg"},
        {url:"src/img/picts/sakura/sakura004.jpg"},
        {url:"src/img/picts/sakura/sakura005.jpg"},
        {url:"src/img/picts/sakura/sakura006.jpg"},
        {url:"src/img/picts/sakura/sakura007.jpg"}
    ];

    var carrousel = new JcarrousselCanvas('carrousel',images,{
        hauteur : 50
    });

    var carrousel1 = new JcarrousselCanvas('carrousel1',images,{
        rayon : 150,
        hauteur : 20,

        reflect: false,
        border: true,
        borderColor: "blue",

        perspective: 0.5
    });

    var carrousel2 = new JcarrousselCanvas('carrousel2',images,{
        rayon : 1,
        hauteur : 150,

        startAngle : 0,

        reflect: false,
        shadow: true,

        perspective: 1
    });

    var carrousel3 = new JcarrousselCanvas('carrousel3',images,{
        rayon : 150,
        hauteur : 150,

        reflect: true,
        shadow: true,
        shadowWidth: 50,
        loose : true,
        step : false
    });
