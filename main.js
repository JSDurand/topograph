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

// add enter funcionality
document.querySelector("#input_label").addEventListener("keyup", event => {
  if (event.key !== "Enter") {return;}
  Submitbutton();
  event.preventDefault();
});

// calculate the positive direction
function routine_positive_calculations (init_1, init_2, init_3) {
  var repeated = false; // A variable to determine if we shall stop.
  var graph    = {};

  for (var area_array = [init_1, init_2, init_3]; !repeated;) {
    graph.positive_indices = [];
    graph.negative_indices = [];

    var l = area_array.length;

    // console.log(area_array);

    for (var i = 0; i < l; i++) {
      if (area_array[i].valeur > 0) {graph.positive_indices.push(i);}
      else if (area_array[i].valeur < 0) {graph.negative_indices.push(i);}
      else {alert('Don\'t input a form which represents 0!');return;}
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
    repeated = init_2.valeur === last_pos.valeur && init_1.valeur === last_neg.valeur && init_3.valeur === new_val;
  }

  return area_array;
}

// calculate the negative direction
function routine_negative_calculations (init_1, init_2, init_3) {
  var repeated = false; // reset the variable
  var graph    = {};

  for (var neg_area_array = [init_1, init_2, init_3]; !repeated;) {
    graph.positive_indices = [];
    graph.negative_indices = [];

    var l = neg_area_array.length;

    for (var i = 0; i < l; i++) {
      if (neg_area_array[i].valeur > 0) {graph.positive_indices.push(i);}
      else if (neg_area_array[i].valeur < 0) {graph.negative_indices.push(i);}
      else {alert('Don\'t input a form which represents 0!');return;}
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
    repeated = init_2.valeur === last_pos.valeur && init_1.valeur === last_neg.valeur && init_3.valeur === new_val;
  }
  return neg_area_array;
}

function gcd (n, m) {
  var r = 0;
  while (n !== 0) {
    r = m % n;
    m = n;
    n = r;
  }
  return m;
};

function find_initial_vector (a, b, c) {
  // To find the initial vector, we first multiply the form by a
  // to suppose that a = 1. In this case we try integers after integers
  // to find a critical integer, and then divide a back.
  // We don't need to actually try out every integer, as we have an
  // upper bound by b/2.
  var initial_vector = {
    x : 0,
    y : 1,
  };

  function weird_form (x) {
    return x * x + b * x * y + a * c * y * y;
  }

  var found      = false;
  var value      = a * c;
  var value_prec = 1 + Math.abs(b) + a * c;

  for (var i = 1; 2 * i < Math.abs(b); i++) {
    temp       = value;
    value      = 2 * (value + 1) - value_prec;
    value_prec = temp;
    if (value < 0) {
      found = true;
      var g = gcd(i,a);
      var x = (b < 0) ? i / g : -i / g;
      var y = a / g;
      initial_vector.x      = x;
      initial_vector.y      = y;
      initial_vector.valeur = a * x * x + b * x * y + c * y * y;

      break;
    }
  }

  if (found) {return initial_vector;} else {alert('not found!');return;}
  
}

function topograph (a,b,c) {
  // calculate the topograph of the form ax^2+bxy+cy^2 and draw on the 
  // context context

  // We first deal with the case ac > 0.
  // We suppose without loss of generality that a > 0.

  a = parseInt(a);
  b = parseInt(b);
  c = parseInt(c);

  var graph = {};
  
  if (a < 0) {topograph(-a,-b,-c);return;}
  if (b*b<=4*a*c) {alert('this is positive definite!');return;}
  if (c < 0) { // a * c < 0 if and only if c < 0
    // a relatively easy case
    // (1,0) -> a
    // (0,1) -> c

    var init0 = create_area(0,1,c);      // p_{-1}
    var init1 = create_area(1,0,a);      // p_0
    var init2 = create_area(1,1,a+b+c);  // p_0+p_{-1}
    var init3 = (a-b+c < 0) ? create_area(-1,1,a-b+c) : create_area(1,-1,a-b+c); // for negative direction

    var area_array     = routine_positive_calculations(init0, init1, init2);
    var neg_area_array = routine_negative_calculations(init0, init1, init3);
  } else if (c > 0) {
    // Now deal with the complex case
    // We need first to find the initial vectors of the river,
    // and the rest is nothing more than routine calculations.

    function form (a, b, c, x, y) {
      // this will be used only several times.
      return a * x * x + b * x * y + c * y * y;
    }

    var initial_vector = find_initial_vector(a,b,c);

    var value0 = initial_vector.valeur;
    var value1 = form(a,b,c,initial_vector.x,initial_vector.y); // < 0
    var value2 = form(a,b,c,initial_vector.x+1,initial_vector.y);
    var value3 = form(a,b,c,initial_vector.x-1,initial_vector.y);

    var init0 = create_area(initial_vector.x, initial_vector.y, value1);
    var init1 = create_area(1,0,a);
    var init2 = create_area(initial_vector.x+1, initial_vector.y, value2);
    var init3 = (value3 < 0) ? create_area(initial_vector.x-1,initial_vector.y,value3) : create_area(1-initial_vector.x,-initial_vector.y,value3);

    var area_array     = routine_positive_calculations(init0,init1,init2);
    var neg_area_array = routine_negative_calculations(init0,init1,init3);
  } else {
    alert('Don\'t input a form which represents 0!');
    return;
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
