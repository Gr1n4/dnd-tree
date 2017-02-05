angular.module('app', [])
  .controller('main', mainController)
  .directive('dndTree', dndTreeDirective)
  .directive('dndTest', dndTestDirective)
  .service('vocService', vocService);

function mainController(
  vocService
) {
  let vm = this;

  vocService.getFunc()
    .then(res => {
      vm.tree = res;
    })
    .catch(rej => {
      console.log('rej get func');
      console.log(rej);
    });

  vm.update = function(from, to, options) {
    console.log('update');
    console.log(from);
    console.log(to);
    console.log(options);
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

      elem.on('dragstart', (e) => {
        console.log('start', e);
        e.dataTransfer.setData('item', attr.dndTest);
      });

      elem.on('dragenter', (e) => {
        e.preventDefault();
        return true;
      });

      elem.on('dragover', (e) => {
        e.preventDefault();
      });

      elem.on('drop', (e) => {
        let fromItem = JSON.parse(e.dataTransfer.getData('item'));
        console.log(fromItem);
        console.log(item);
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
