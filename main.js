// collaborated with Kuei You

if (!Array.prototype.last){
    Array.prototype.last = function(){
        return this[this.length - 1];
    };
};

if (!Array.prototype.next_to_last){
    Array.prototype.next_to_last = function(){
      if (this.length < 2) {alert("undefined");return;}
        return this[this.length - 2];
    };
};

function create_area (px, py, v) {
  return {
    x      : px,
    y      : py,
    valeur : v,
  }
}

var my  = {};
var div = document.createElement('div');
var can = document.createElement('canvas');

var width  = window.innerWidth;
var height = window.innerHeight;

var epsilon  = width/20;

div.id = "container";
can.id = "can";

div.style  = "width:"+width*0.9+"px;height:"+height*0.8+"px";

can.width  = width;
can.height = height;

document.body.appendChild(div);
div.appendChild(can);

var ctx       = can.getContext('2d');
ctx.lineWidth = 5;

function line (x0,y0,x1,y1,con) {
  con.beginPath()
  con.moveTo(x0,y0);
  con.lineTo(x1,y1);
  con.stroke();
}

// the algorithm to calculate the topograph of a quadratic form

function isInt(value) {
  return !isNaN(value) && 
         parseInt(Number(value)) == value && 
         !isNaN(parseInt(value, 10));
}

function Submitbutton () {
  var a = document.getElementById('a_textfield').value;
  var b = document.getElementById('b_textfield').value;
  var c = document.getElementById('c_textfield').value;
  if (!isInt(a) || !isInt(b) || !isInt(c)){alert("Please input integers!");}
  else {topograph(parseInt(a),parseInt(b),parseInt(c));}
}

function topograph (a,b,c) {
  // calculate the topograph of the form ax^2+bxy+cy^2 and draw on the 
  // context context

  //can     = document.getElementById('can');
  //context = can.getContext('2d');

  // We first deal with the case ac > 0.
  // We suppose without loss of generality that a > 0.

  a = parseInt(a);
  b = parseInt(b);
  c = parseInt(c);

  var graph = {};
  
  if (a < 0) {topograph(-a,-b,-c);return;}
  if (b*b<=4*a*c) {alert('this is positive definite!');return;}
  if (a*c < 0) {
    // a relatively easy case
    // (1,0) -> a
    // (0,1) -> c

    // var form = function (x, y) {
      // return a * x * x + b * x * y + c * y * y;
    // }

    var init0 = create_area(0,1,c);      // p_{-1}
    var init1 = create_area(1,0,a);      // p_0
    var init2 = create_area(1,1,a+b+c);  // p_0+p_{-1}
    var init3 = (a-b+c < 0) ? create_area(-1,1,a-b+c) : create_area(1,-1,a-b+c); // negative direction

    var repeated = false; // A variable to determine if we shall stop.

    for (var area_array = [init0, init1, init2]; !repeated;) {
      graph.positive_indices = [];
      graph.negative_indices = [];

      var l = area_array.length;

      for (var i = 0; i < l; i++) {
        if (area_array[i].valeur > 0) {graph.positive_indices.push(i);}
        else if (area_array[i].valeur < 0) {graph.negative_indices.push(i);}
      }

      var last_pos = area_array[graph.positive_indices.last()];
      var last_neg = area_array[graph.negative_indices.last()];

      if (area_array.last().valeur < 0) {
        var ntl_neg   = area_array[graph.negative_indices.next_to_last()];
        var new_vec_x = area_array.last().x + last_pos.x;
        var new_vec_y = area_array.last().y + last_pos.y;
        var new_val   = 2 * (last_neg.valeur + last_pos.valeur) - ntl_neg.valeur;
        if (new_val === 0) {alert('Don\'t input a form which represents 0!!!');return area_array;}
        // alert(ntl_neg);
        area_array.push(create_area(new_vec_x, new_vec_y, new_val));
      } else if (area_array.last().valeur > 0) {
        var ntl_pos   = area_array[graph.positive_indices.next_to_last()];
        var new_vec_x = area_array.last().x + last_neg.x;
        var new_vec_y = area_array.last().y + last_neg.y;
        var new_val   = 2 * (last_neg.valeur + last_pos.valeur) - ntl_pos.valeur;
        if (new_val === 0) {alert('Don\'t input a form which represents 0!!!');return area_array;}
        area_array.push(create_area(new_vec_x, new_vec_y, new_val));
      }
      repeated = init1.valeur === last_pos.valeur && init0.valeur === last_neg.valeur && init2.valeur === new_val;
    }

    var repeated = false; // reset the variable

    for (var neg_area_array = [init0, init1, init3]; !repeated;) {
      // calculate the negative direction
      graph.positive_indices = [];
      graph.negative_indices = [];

      var l = neg_area_array.length;

      for (var i = 0; i < l; i++) {
        if (neg_area_array[i].valeur > 0) {graph.positive_indices.push(i);}
        else if (neg_area_array[i].valeur < 0) {graph.negative_indices.push(i);}
      }

      var last_pos = neg_area_array[graph.positive_indices.last()];
      var last_neg = neg_area_array[graph.negative_indices.last()];

      if (neg_area_array.last().valeur < 0) {
        var ntl_neg   = neg_area_array[graph.negative_indices.next_to_last()];
        var new_val   = 2 * (last_neg.valeur + last_pos.valeur) - ntl_neg.valeur;
        if (new_val > 0) {
          var new_vec_x = last_pos.x - last_neg.x;
          var new_vec_y = last_pos.y - last_neg.y;
        } else if (new_val < 0) {
          var new_vec_x = last_neg.x - last_pos.x;
          var new_vec_y = last_neg.y - last_pos.y;
        } else {
          alert('Don\'t input a form which represents 0!!!');
          return neg_area_array;
        }
        neg_area_array.push(create_area(new_vec_x, new_vec_y, new_val));
      } else if (neg_area_array.last().valeur > 0) {
        var ntl_pos   = neg_area_array[graph.positive_indices.next_to_last()];
        var new_val   = 2 * (last_neg.valeur + last_pos.valeur) - ntl_pos.valeur;
        if (new_val > 0) {
          var new_vec_x = last_pos.x - last_neg.x;
          var new_vec_y = last_pos.y - last_neg.y;
        } else if (new_val < 0) {
          var new_vec_x = last_neg.x - last_pos.x;
          var new_vec_y = last_neg.y - last_pos.y;
        } else {
          alert('Don\'t input a form which represents 0!!!');
          return neg_area_array;
        }
        neg_area_array.push(create_area(new_vec_x, new_vec_y, new_val));
      }
      repeated = init1.valeur === last_pos.valeur && init0.valeur === last_neg.valeur && init3.valeur === new_val;
    }

  } else {
    alert('Only the case a*c < 0 and a > 0 is implemented!');
  }

  draw_area_array(area_array);
  draw_negative_area_array(neg_area_array);
  return neg_area_array+area_array;
}

function draw_area_array (arr) {
  var l     = arr.length;
  can       = document.getElementById('can');
  context   = can.getContext('2d');
  context.clearRect(0,0, width, height);

  can.height = height*0.75;
  can.width  = 30*width;
  var stepx  = 0;
  var cur    = can.width/2;
  // var cur_x  = epsilon;
  // var cur_y  = height/2;

  // for (var i = 2; i < l; i++) {cur += context.measureText('('+arr[i].x+','+arr[i].y+')').width + 2*epsilon;}
  context.font = '30px Arial';
  line(0,can.height/2,can.width,can.height/2,context);
  // line(epsilon+cur,can.height/2,epsilon+cur,can.height/4,context);
  context.fillText('('+arr[0].x+','+arr[0].y+')',epsilon*3/2+cur, can.height/2+epsilon);
  context.fillText(arr[0].valeur,epsilon*3/2+cur, can.height/2+epsilon/2);
  // line(epsilon*3, can.height/2, epsilon*3, can.height/4,context);
  context.fillText('('+arr[1].x+','+arr[1].y+')',epsilon*3/2+cur, can.height/2-epsilon/2);
  context.fillText(arr[1].valeur,epsilon*3/2+cur, can.height/2-epsilon);
  stepx   = context.measureText('('+arr[1].x+','+arr[1].y+')').width + 2*epsilon;
  cur += stepx;
  // stepx = width/10;
  // line(epsilon*3, can.height/2, epsilon*3, can.height*3/4,context);
  for (var i = 2; i < l; i++) {
    var ari = arr[i];
    stepx   = context.measureText('('+ari.x+','+ari.y+')').width + 2*epsilon;
    var h   = (ari.valeur > 0) ? can.height/4 : can.height*3/4;
    var ht  = (ari.valeur > 0) ? -epsilon/2 : epsilon;
    var hv  = (ari.valeur > 0) ? -epsilon   : epsilon/2;
    line(epsilon+cur,can.height/2,epsilon+cur,h,context);
    // var cur_x = 
    context.fillText('('+ari.x+','+ari.y+')',epsilon*3/2+cur, can.height/2+ht);
    context.fillText(ari.valeur,epsilon*3/2+cur, can.height/2+hv);
    cur += stepx;
  }
  document.getElementById('container').scrollLeft = can.width/2;
}

function draw_negative_area_array (arr) {
  // draw in the negative direction!
  var l     = arr.length;
  can       = document.getElementById('can');
  context   = can.getContext('2d');

  var stepx  = 0;
  var cur    = can.width/2;

  for (var i = 2; i < l; i++) {
    var ari = arr[i];
    stepx   = context.measureText('('+ari.x+','+ari.y+')').width;
    var h   = (ari.valeur > 0) ? can.height/4 : can.height*3/4;
    var ht  = (ari.valeur > 0) ? -epsilon/2 : epsilon;
    var hv  = (ari.valeur > 0) ? -epsilon   : epsilon/2;
    line(cur,can.height/2,cur,h,context);
    cur -= stepx+width/30;
    context.fillText('('+ari.x+','+ari.y+')',cur, can.height/2+ht);
    context.fillText(ari.valeur,cur, can.height/2+hv);
    cur -= epsilon;
  }
  document.getElementById('container').scrollLeft = can.width/2;
}
