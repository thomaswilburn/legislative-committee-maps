//var committee ={};

// Get names of the committees
var populateDropDown= function(state) {
  var committeeListRequest = $.ajax({
    dataType: "json",
    url: "http://openstates.org/api/v1/committees/",
    data: {
      state: state,
      apikey: "9e3e71730ae34e1ebbf4dd0e1c346c07"
    }
  }).done(function(committeeList) {
      committees = _.reject(committeeList, 'subcommittee');
      upperCommittees = _.where(committees, {chamber: "upper"});
      lowerCommittees = _.where(committees,{chamber:"lower"});
      sortedUpperCommittees = _.sortBy(upperCommittees, 'committee');
      sortedLowerCommittees = _.sortBy(lowerCommittees, 'committee');

      var sortedUpperOutput = "";
        $.each(sortedUpperCommittees, function(key, val) {
        sortedUpperOutput += '<li><a href="#"  data-cmte-id="' + val.id +'">' + val.committee + '</a></li>';
      });
      var sortedLowerOutput = "";
        $.each(sortedLowerCommittees, function(key, val) {
        sortedLowerOutput += '<li><a href="#"  data-cmte-id="' + val.id +'">' + val.committee + '</a></li>';
      });

      $('ul#tinyDropUpper').prepend(sortedUpperOutput);
      $('ul#tinyDropLower').prepend(sortedLowerOutput);
    })
};

// Get committee detail
var getCommitteeDetail= function (committee_id) {
  var committeeRequest = $.ajax({
    dataType: "json",
    url: "http://openstates.org/api/v1/committees/" + committee_id + "/",
    data: {
      apikey: "9e3e71730ae34e1ebbf4dd0e1c346c07"
    }
  }).done(function(committee, textStatus, jqXHR){
      console.log("DONE", textStatus, jqXHR);
      leg_id_array = _.pluck(committee.members, 'leg_id');
addLegislators(committee)
    });
};

// append legislator detail to committee
var addLegislators = function(committee) {
//  $('#update1-left pre').html("<h2>"+committee.committee+"</h2>");
  var counter = 0;
  committee.members.forEach(function(member, i) {
    var memberListRequest = $.ajax({
    dataType: "json",
    url: "http://openstates.org/api/v1/legislators/" + member.leg_id, //committee.members[i].leg_id,
    data: {
//      state: state,
      active: true,
      apikey: "9e3e71730ae34e1ebbf4dd0e1c346c07"
    }
  }).done(function(memberDetail) {
        if (memberDetail.active) {
//          console.log(memberDetail.full_name, "active");
        } else {
//          console.log(memberDetail.full_name, "inactive");
        }
        member.detail = memberDetail;
        counter++;
//        console.log("[[[",counter, i,"]]]");
        if (counter === committee.members.length) {
//          console.log("activeInIf",member.detail.active);
//          $('#update1-left pre').append(JSON.stringify(committee, null, 2));
          listMembers(committee);
        }
      //     }
      });

  });

};

function listMembers(committee) {
//  console.log("listMembers: ", committee);
  _.each(committee.members, function (member, i) {
    if (member.role.toLowerCase() === "member") {
     member.role = null;
  } else if (member.role) {
      member.role = member.role.capitalize();
    }
    // just first letter of party
    if (member.detail.party) {
     member.detail.party = member.detail.party.slice(0,1);
  }
  });

  //create context for template
  var context = {
    cmte: committee
  };

  var html = app.memberTemplate(context);
  $('#committee-list')
    .html(html);

  var memberDetail;
//  $("[data-member-id]").on("click", function(e) {
  jQuery(document.body).on("click", "[data-member-id]", function(e) {
    var ID = $(this).data("member-id");
 //   console.log("committee",committee.members);
    memberDetail = _.findWhere(committee.members, {leg_id: ID});
//    setTimeout(500);
 //   console.log("findwhere");
    memberDetailFunction(memberDetail);
  });
}

function memberDetailFunction(mDetail){
  var memberContext = {
    members: mDetail instanceof Array ? mDetail : [mDetail]
  };
  // console.log("memberContext: ", memberContext);
  var htmlDetail = app.memberDetail(memberContext);
//  var htmlDetail = templateDetail(memberContext);
  if (memberContext.members.length>0) {
    // console.log("length > 1", memberContext.members.length);
    $('#member-detail').html(htmlDetail);
  } else {
    $('#member-detail').html('<p>Click a committee member<br />for detail. <br />Click the <i class="fa fa-link"></i> icon to visit the committee website. (It will open in a new window.) </p>');
  }
}


$(document.body).on("click", "[data-cmte-id]",function(e) {
  e.preventDefault();
  var committee_id = $(this).data("cmte-id");
  console.log('data-committee', committee_id);
  $(this).parent().parent()
    .css('left', '-99999px')
    .removeClass("open");
  $(".panel").html("Click a committee member for detail.");
  getCommitteeDetail(committee_id);
});


// http://css-tricks.com/snippets/javascript/get-url-variables/
function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    if(pair[0] == variable){return pair[1];}
  }
  return(false);
}


/*!
 query-string
 Parse and stringify URL query strings
 https://github.com/sindresorhus/query-string
 by Sindre Sorhus
 MIT License
 */
(function () {
  'use strict';
  var queryString = {};
  queryString.parse = function (str) {
    if (typeof str !== 'string') {
      return {};
    }
    str = str.trim().replace(/^\?/, '');
    if (!str) {
      return {};
    }
    return str.trim().split('&').reduce(function (ret, param) {
      var parts = param.replace(/\+/g, ' ').split('=');
      var key = parts[0];
      var val = parts[1];
      key = decodeURIComponent(key);
      // missing `=` should be `null`:
      // http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
      val = val === undefined ? null : decodeURIComponent(val);
      if (!ret.hasOwnProperty(key)) {
        ret[key] = val;
      } else if (Array.isArray(ret[key])) {
        ret[key].push(val);
      } else {
        ret[key] = [ret[key], val];
      }
      return ret;
    }, {});
  };
  queryString.stringify = function (obj) {
    return obj ? Object.keys(obj).map(function (key) {
      var val = obj[key];
      if (Array.isArray(val)) {
        return val.map(function (val2) {
          return encodeURIComponent(key) + '=' + encodeURIComponent(val2);
        }).join('&');
      }
      return encodeURIComponent(key) + '=' + encodeURIComponent(val);
    }).join('&') : '';
  };
  queryString.push = function (key, new_value) {
    var params = queryString.parse(location.search);
    if(new_value == null){
      delete params[key];
    } else {
      params[key] = new_value;
    }
    var new_params_string = queryString.stringify(params);
    history.pushState({}, "", window.location.pathname + '?' + new_params_string);
  };
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = queryString;
  } else {
    window.queryString = queryString;
  }
})();



$("select").change(function(){
  console.log($(this).val());
  var selectedState = $(this).val();
  queryString.push('state', selectedState);
  window.location.reload();
//  populateDropDown(state);
});


Handlebars.registerHelper('breaklines', function(text) {
  text = Handlebars.Utils.escapeExpression(text);
  //some legislators, such as VAL000157 have successive newlines in the offices.address fields
  text = text.replace(/(\n ?\n)/gm, '\n');
  //replace "\n" with "<br />"
  text = text.replace(/(\r\n|\n|\r)/gm, '<br />');
  return new Handlebars.SafeString(text);
});

var app = {};

function init() {
  var state1 = getQueryVariable("state");
  $('select option[value="' + state1 + '"]').prop('selected',true);
//  console.log("INIT>>>>>");
  populateDropDown(state1);

  var sourceMembers = $("#committee-member-template")
    .html();
  app.memberTemplate = Handlebars.compile(sourceMembers);

  var sourceMemberDetail = $("#committee-member-detail-template")
    .html();
  app.memberDetail = Handlebars.compile(sourceMemberDetail);

}

String.prototype.capitalize = function(){ return this.replace( /(^|\s)[a-z]/g , function(m){ return m.toUpperCase(); }); };

init();
