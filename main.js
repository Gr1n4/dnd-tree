angular.module('app', [])
  .controller('main', mainController)
  .directive('dndTree', dndTreeDirective)
  .directive('dndTest', dndTestDirective)
  .service('vocService', vocService);

function mainController(
  $timeout,
  vocService
) {
  let vm = this;
  vm.rerender = true;

  vocService.getFunc()
    .then(res => {
      prepareTree(res);
      vm.tree = res;
    })
    .catch(rej => {
      console.log('rej get func');
      console.log(rej);
    });

  function prepareTree(tree) { 
    function rec(tree) {
      angular.forEach(tree, item => {
        item.element.toggle = false;
        if (item.child && item.child.length) {
          rec(item.child);
        }
      });
    }
    rec(tree);
  }

  vm.update = function(from, to, options) {
    let findedElem = {
        check: false,
        parentArr: null,
        index: -1
      }
      , deletedElem = {
        check: false,
        elem: null
      };

    function rec(tree, parentArr) {
      for (let i = 0; i < tree.length; i++) {
        if (tree[i].element.id === from.id) {
          deletedElem.elem = tree.splice(i, 1)[0];
          deletedElem.check = true;
          if (findedElem.check) {
            findedElem.parentArr.splice(findedElem.index + 1, 0, deletedElem.elem);
            break;
          }
        }
        if (tree[i].element.id === to.id) {
          findedElem.parentArr = tree;
          findedElem.index = i;
          findedElem.check = true;
          if (deletedElem.check) {
            findedElem.parentArr.splice(findedElem.index + 1, 0, deletedElem.elem);
            break;
          }
        }
        if (tree[i].child && tree[i].child.length) {
          rec(tree[i].child, tree);
        }
      }
    }
    rec(vm.tree, []);
    vm.rerender = false;
    $timeout(() => {
      vm.rerender = true;
    }, 200);
  };
}

function dndTestDirective(
  $compile
) {
  return {
    template: `
      <ng-transclude></ng-transclude>
    `,
    restrict: 'A',
    transclude: true,
    link: function(scope, elem, attr) {
      let item = JSON.parse(attr.dndTest);
      elem.attr('draggable', 'true');
      console.log('test');

      elem.on('dragstart', (e) => {
        console.log('start', e);
        e.dataTransfer.setData('item', attr.dndTest);
      });

      elem.on('dragenter', (e) => {
        e.preventDefault();
        console.log('enter', e);
        return true;
      });

      elem.on('dragover', (e) => {
        e.preventDefault();
        //console.log('over', e);
      });

      elem.on('drop', (e) => {
        let fromItem = JSON.parse(e.dataTransfer.getData('item'));
        console.log('fromItem');
        console.log(fromItem);
        console.log('toItem');
        console.log(item);
        console.log('drop', e);
        scope.$parent.update()(fromItem, item);
        //console.log(e.dataTransfer.getData('item'));
      });
    }
  }
}

function vocService(
  $http,
  $q
) {
  this.getFunc = function() {
    let defer = $q.defer();
    $http.get('http://api.corp.profgallery.ru/api/vocabulary/gejob_function/tree/')
    .then(res => {
      if (res.status === 200 && res.data.status === 'success') {
        defer.resolve(res.data.items);
      } else {
        defer.reject(res.data);
      }
    })
    .catch(rej => {
      defer.reject(rej);
    });

    return defer.promise;
  }

  return this;
}
