function button_callback() {
    if (typeof document.initialized !== 'undefined')
        return;

    document.initialized = true;

    var canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    canvas.id = "anascanvas";
    document.body.appendChild(canvas);
    var update_memory = pico.instantiate_detection_memory(5); // we will use the detecions of the last 5 frames
    var facefinder_classify_region = function (r, c, s, pixels, ldim) {
        return -1.0;
    };
    var cascadeurl = 'https://raw.githubusercontent.com/nenadmarkus/pico/c2e81f9d23cc11d1a612fd21e4f9de0921a5d0d9/rnt/cascades/facefinder';
    fetch(cascadeurl).then(function (response) {
        response.arrayBuffer().then(function (buffer) {
            var bytes = new Int8Array(buffer);
            facefinder_classify_region = pico.unpack_cascade(bytes);
            console.log('* facefinder loaded');
        })
    });

    var do_puploc = function (r, c, s, nperturbs, pixels, nrows, ncols, ldim) {
        return [-1.0, -1.0];
    };
    var puplocurl = 'https://f002.backblazeb2.com/file/tehnokv-www/posts/puploc-with-trees/demo/puploc.bin';
    fetch(puplocurl).then(function (response) {
        response.arrayBuffer().then(function (buffer) {
            var bytes = new Int8Array(buffer);
            do_puploc = lploc.unpack_localizer(bytes);
            console.log('* puploc loaded');
        })
    });
    var ctx = document.getElementById('anascanvas').getContext('2d');


    function rgba_to_grayscale(rgba, nrows, ncols) {
        var gray = new Uint8Array(nrows * ncols);
        for (var r = 0; r < nrows; ++r)
            for (var c = 0; c < ncols; ++c)
                // gray = 0.2*red + 0.7*green + 0.1*blue
                gray[r * ncols + c] = (2 * rgba[r * 4 * ncols + 4 * c + 0] + 7 * rgba[r * 4 * ncols + 4 * c + 1] + 1 * rgba[r * 4 * ncols + 4 * c + 2]) / 10;
        return gray;
    }


    var processfn = function (video, dt) {
        // render the video frame to the canvas element and extract RGBA pixel data
        ctx.drawImage(video, 0, 0);
        var rgba = ctx.getImageData(0, 0, 640, 480).data;
        // prepare input to `run_cascade`
        image = {
            "pixels": rgba_to_grayscale(rgba, 480, 640),
            "nrows": 480,
            "ncols": 640,
            "ldim": 640
        };
        params = {
            "shiftfactor": 0.1, // move the detection window by 10% of its size
            "minsize": 100, // minimum size of a face
            "maxsize": 1000, // maximum size of a face
            "scalefactor": 1.1 // for multiscale processing: resize the detection window by 10% when moving to the higher scale
        };
        // run the cascade over the frame and cluster the obtained detections
        // dets is an array that contains (r, c, s, q) quadruplets
        // (representing row, column, scale and detection score)
        dets = pico.run_cascade(image, facefinder_classify_region, params);
        dets = update_memory(dets);
        dets = pico.cluster_detections(dets, 0.2); // set IoU threshold to 0.2
        // draw detections
        for (i = 0; i < dets.length; ++i)
            // check the detection score
            // if it's above the threshold, draw it
            // (the constant 50.0 is empirical: other cascades might require a different one)

            if (dets[i][3] > 50.0) {
                var r, c, s;
                r = dets[i][0] - 0.075 * dets[i][2];
                c = dets[i][1] - 0.175 * dets[i][2];
                s = 0.35 * dets[i][2];
                [r, c] = do_puploc(r, c, s, 63, image);

                r1 = dets[i][0] - 0.075 * dets[i][2];
                c1 = dets[i][1] + 0.175 * dets[i][2];
                s1 = 0.35 * dets[i][2];
                [r1, c1] = do_puploc(r1, c1, s1, 63, image);

                x = (c1 + c) / 2;
                y = (r1 + r) / 2;
                z = dets[i][2];
                //x100 500   y100 350
                myfunc(x, y, z);
                if (r >= 0 && c >= 0) {
                    ctx.beginPath();
                    ctx.arc((c1 + c) / 2, (r1 + r) / 2, 1, 0, 2 * Math.PI, false);
                    ctx.lineWidth = 3;
                    ctx.strokeStyle = 'red';
                    ctx.stroke();
                }

            }
    };

    var mycamvas = new camvas(ctx, processfn);
}


var n = 5;
var nz = 5;
var u = [];
var v = [];
var w = [];
for (i = 0; i < n; i++) {
    u.push(0);
    v.push(0);
}
for (i = 0; i < nz; i++) {
    w.push(0);
}
var ind = 0;
var indz = 0;

/*
var n = 3;
var nz = 40;
var u = [];
var v = [];
var w = [];
for (i = 0; i < n; i++) {
    u.push(0);
    v.push(0);
}
for (i = 0; i < nz; i++) {
    w.push(0);
}
var ind = 0;
var indz = 0;
var myfunc = function(x, y, z) {
    u[ind] = x;
    v[ind] = y;
    w[indz] = z;
    a = u.reduce(function (a, b) { return a + b }, 0)/n;
    b = v.reduce(function (a, b) { return a + b }, 0)/n;
    c = w.reduce(function (a, b) { return a + b }, 0)/nz;

    draw(500-a,500-b,c);

//console.log(a,b,c,x,y)

    ind = (ind + 1) % n;
    indz = (indz + 1) % nz;

};
*/
