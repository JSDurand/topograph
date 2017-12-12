// the algorithm to calculate the topograph of a quadratic form

// var area = {
//   vector : (0,0);
//   value  : 0;
// };

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

function topograph (a,b,c,context) {
  // calculate the topograph of the form ax^2+bxy+cy^2 and draw on the 
  // context context

  line(width/2,height/2,width/2,0);

  // We first deal with the case ac > 0.
  // We suppose without loss of generality that a > 0.

  var graph = {};
  
  if (a < 0) {topograph(-a,-b,-c,context);return;}
  if (b*b<=4*a*c) {alert('this is positive definite!');}
  if (a*c < 0) {
    // a relatively easy case
    // (1,0) -> a
    // (0,1) -> c

    // var form = function (x, y) {
      // return a * x * x + b * x * y + c * y * y;
    // }

    var init0      = create_area(0,1,c); // p_{-1}
    var init1      = create_area(1,0,a); // p_0
    var init2      = create_area(1,1,a+b+c); // p_0+p_{-1}

    var repeated   = false; // A variable to determine if we shall stop.

    for (var area_array = [init0, init1, init2]; !repeated;) {
      graph.positive_indices = [];
      graph.negative_indices = [];

      var l = area_array.length;

      for (var i = 0; i < l; i++) {
        if (area_array[i].valeur > 0) {graph.positive_indices.push(i);}
        if (area_array[i].valeur < 0) {graph.negative_indices.push(i);}
      }

      var last_pos = area_array[graph.positive_indices.last()];
      var last_neg = area_array[graph.negative_indices.last()];


      if (area_array.last().valeur < 0) {
        var ntl_neg   = area_array[graph.negative_indices.next_to_last()];
        var new_vec_x = area_array.last().x + last_pos.x;
        var new_vec_y = area_array.last().y + last_pos.y;
        var new_val   = 2 * (last_neg.valeur + last_pos.valeur) - ntl_neg.valeur;
        // alert(ntl_neg);
        area_array.push(create_area(new_vec_x, new_vec_y, new_val));
      } else if (area_array.last().valeur > 0) {
        var ntl_pos   = area_array[graph.positive_indices.next_to_last()];
        // if (typeof ntl_pos === 'undefined') {
          // alert(graph.positive_indices.length);
          // alert("all values");
          // for (var i = 0; i < area_array.length; i++) {
            // alert(area_array[i].valeur);
          // }
          // // alert(area_array.last().x + "and" + area_array.last().y + "has value" + area_array.last().valeur);
        // }
        var new_vec_x = area_array.last().x + last_neg.x;
        var new_vec_y = area_array.last().y + last_neg.y;
        var new_val   = 2 * (last_neg.valeur + last_pos.valeur) - ntl_pos.valeur;
        area_array.push(create_area(new_vec_x, new_vec_y, new_val));
      }
      repeated = init1.valeur === last_pos.valeur && init0.valeur === last_neg.valeur && init2.valeur === new_val;

      // alert(area_array.last().x + "and" + area_array.last().y + "has value" + area_array.last().valeur);
    }

    return area_array;
  }
}
