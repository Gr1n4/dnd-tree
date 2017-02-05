'use strict';

function dndTreeDirective(

) {
  return {
    restrict: 'E',
    templateUrl: './dnd-tree.view.html',
    scope: {
      tree: '=',
      update: '&'
    },
    link: function(scope, elem, attr) {

    }
  }
}
