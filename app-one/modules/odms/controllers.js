/*
* julietONE odms controller - v0.0.1
* An angularJS controller for odms modules
*/
(function () {
/* jshint -W100 */
﻿'use strict';

angular.module('ODMS')
/**
* @ngdoc controller
* @name ODMS.controller:FoldersCtrl
* @description
* A controller for the dashboard page of JulietONE Sample
*
* nNEw line
*/
// odms/main/views/folders.html
.controller('FoldersCtrl', ['GAPIServices', 'DataServices', '$rootScope', '$scope', function (GAPIServices, DataServices, $rootScope, $scope) {
  $scope.data = {ID:0, name:'', desc:'', parentID:'', folderID:'', fieldList:''};
  $scope.result = {};

  $scope.submit = function () {
    GAPIServices.login().then(function () {
      if ($scope.data.ID == 0) {
        $scope.data = {action:'add', ID:$scope.data.ID, name:$scope.data.name, desc:$scope.data.desc, parentID:0, folderID:randomString(8), fieldList:$scope.data.fieldList};
        DataServices.Submit('doFolders', $scope.data, function(response) {
          $scope.result.notify = 'Saving record ...';
          $scope.newID = response.data.ID;
          if (response.success != undefined) {
            GAPIServices.createFolder($scope.data.name).then(function(gapiResponse) {
              $scope.result.notify = 'Creating folder ...';
              if (gapiResponse.id != undefined) {
                $scope.data = {action:'update', ID:$scope.newID, name:$scope.data.name, desc:$scope.data.desc, parentID:0, folderID:gapiResponse.id, fieldList:$scope.data.fieldList};
                DataServices.Submit('doFolders', $scope.data, function(response) {
                  $scope.result = response;
                });
              } else {
                $scope.result.error = 'Error while creating folder in drive.';
              }
            });
          } else {
            $scope.result = response;
          }
        });
      } else {
        $scope.data = {action:'update', ID:$scope.data.ID, name:$scope.data.name, abbr:$scope.data.desc, parentID:0, folderID:$scope.data.folderID, fieldList:$scope.data.fieldList};
        DataServices.Submit('doFolders', $scope.data, function (response) {
          if (response.success !== undefined) {
            GAPIServices.rename($scope.data.folderID, $scope.data.name, function (resp) {});
            $scope.result = response;
          } else {
            $scope.result = response;
          }
       });
     }
   });
 };

 $scope.edit = function (id) {
   $scope.result = {};
   DataServices.Edit('Folders', id, function (response) {
     $scope.data = response;
   });
 };

  $scope.reset = function () {
    $scope.data = {ID:0, name:'', desc:'', folderID:'', fieldList:''};
  };
}]) // folders

// odms/main/views/sub-folders.html
.controller('SubFoldersCtrl', ['GAPIServices', 'DataServices', '$rootScope', '$scope', '$filter', function (GAPIServices, DataServices, $rootScope, $scope, $filter) {
  $scope.data = {ID:0, name:'', desc:'', parentID:0, folderID:'', fieldList:''};
  $scope.result = {};
  $scope.fieldListJson = [];

  // get heads
  DataServices.SelectData('Folders', 'name', function(response) {
    $scope.folders = response;
    $scope.selectedFolder = $scope.folders[0];
  });

  $scope.selectFolder = function(selectedFolder) {
    $scope.data.parentID = selectedFolder.id;
    $scope.data.desc = selectedFolder.desc;
    $scope.parentFolderID = selectedFolder.folderID;

    // add dynamic fields
    $scope.fieldListJson = [];
    if (selectedFolder.fieldList) {
      angular.forEach(selectedFolder.fieldList.split("#"), function(value, key) {
        $scope.fieldListJson.push({'fieldName':value, 'fieldValue':''});
      });
    }
  };

  $scope.submit = function () {
    $scope.data.fieldList = getFeildListsValues();

    //authenticating with google drive
    GAPIServices.login().then(function () {
      if ($scope.data.ID == 0) {
        $scope.data = {action:'add', ID:$scope.data.ID, name:$scope.data.name, desc:$scope.data.desc, parentID:$scope.data.parentID, folderID:randomString(8), fieldList:$scope.data.fieldList};
        DataServices.Submit('doFolders', $scope.data, function (response) {
          $scope.result.notify = 'Saving record...';
          $scope.newID = response.data.ID;
          if (response.success != undefined) {
            GAPIServices.createSubFolder($scope.data.name, $scope.parentFolderID).then(function(gapiResponse) {
              $scope.result.notify = 'Creating folder...';
              if (gapiResponse.id != undefined) {
                var para = {action:'update', ID:$scope.newID, name:$scope.data.name, desc:$scope.data.desc, parentID:$scope.data.parentID, folderID:gapiResponse.id, fieldList:$scope.data.fieldList};
                DataServices.Submit('doFolders', para, function(response) {
                  $scope.result = response;
                });
              } else {
                $scope.result.error = 'Error while creating folder';
              }
            });
          } else {
            $scope.result = response;
          }
        });
      } else {
        $scope.data = {action:'update', ID:$scope.data.ID, name:$scope.data.name, desc:$scope.data.desc, parentID:$scope.data.parentID, folderID:$scope.data.folderID, fieldList:$scope.data.fieldList};
        DataServices.Submit('doFolders', $scope.data, function (response) {
          if (response.success != undefined) {
            if ($scope.data.folderID.length == 8) {
              GAPIServices.createSubFolder($scope.data.name, $scope.parentFolderID).then(function(gapiResponse) {
                $scope.result.notify = 'Creating folder...';
                if (gapiResponse.id != undefined) {
                  var para = {action:'update', ID:$scope.data.ID, name:$scope.data.name, desc:$scope.data.desc, parentID:$scope.data.parentID, folderID:gapiResponse.id, fieldList:$scope.data.fieldList};
                  DataServices.Submit('doFolders', para, function(response) {
                    $scope.result = response;
                  });
                } else {
                  $scope.result.error = 'Error while creating folder';
                }
              });
            } else {
              GAPIServices.rename($scope.data.folderID, $scope.data.name, function (resp){});
              $scope.result = response;
            }
          } else {
            $scope.result = response;
          }
       });
     }
   });
 };

  $scope.edit = function (id) {
    $scope.result = {};
    DataServices.Edit('Folders', id, function (response) {
      $scope.data = response;
      $scope.selectedFolder = $filter('filter')($scope.folders, {'id': $scope.data.parentID}, true)[0];
      $scope.parentFolderID = $scope.selectedFolder.folderID;

      // dynamic fields
      $scope.fieldListJson = [];
      if ($scope.selectedFolder.fieldList) {
        angular.forEach(response.fieldList.split(';'), function(value, key) {
          $scope.fieldListJson.push({'fieldName':$scope.selectedFolder.fieldList.split('#')[key], 'fieldValue':value});
        });
      }
    });
  };

  $scope.reset = function () {
    $scope.data = {ID:0, name:'', desc:'', parentID:'', folderID:'', fieldList:''};
    $scope.selectedFolder = $scope.folders[0];
  };

  function getFeildListsValues() {
    var values = '';
    for(var i = 0; i < $scope.fieldListJson.length; i++) {
      values += $scope.fieldListJson[i].fieldValue + ';';
    }
    return values.replace(/;\s*$/, ""); // remove last semi-commas
  }
}]) // sub-folders

// odms/main/views/tags.html
.controller('TagsCtrl', ['DataServices', '$rootScope', '$scope', function (DataServices, $rootScope, $scope) {
  $scope.data = {ID:0, name:'', desc:''};

  $scope.submit = function () {
    $scope.data = {ID:$scope.data.ID, name:$scope.data.name, desc:$scope.data.desc};
    DataServices.Submit('doTags', $scope.data, function (response) {
      $scope.result = response;
    });
  };

  $scope.edit = function (id) {
    $scope.result = {};
    DataServices.Edit('tags', id, function (response) {
      $scope.data = response;
    });
  };

  $scope.reset = function () {
    $scope.data = {ID:0, name:'', desc:''};
  };
}]) // tags

// odms/main/views/upload-doc.html
.controller('UploadDocCtrl', ['$q', 'GAPIServices', 'DataServices', '$rootScope', '$scope', '$filter', function ($q, GAPIServices, DataServices, $rootScope, $scope, $filter) {
  $scope.data = {ID:0, folderID:0, docID:'OD' + randomString(8), name:'', desc:'', tags:'', fileID:randomString(8), isAuth:0};
  $scope.result = {};
  $scope.tagsModel = [];

  // sub heads
  DataServices.SelectData('SubFolders', 'name', function (response) {
    $scope.subFolders = response;
    $scope.selectedSubFolder = function(selected) {
      if (selected) {
        $scope.data.folderID = selected.originalObject.id;
        $scope.folderTitle = selected.originalObject.name;
        $scope.desc = selected.originalObject.desc;
      }
    };
  });

  loadTags();

  $scope.browse = function () {
    document.getElementById('uploadFile').click();
  };

  $scope.getFile = function () {
    var allFiles = document.getElementById('uploadFile').files;
    var file = allFiles[0];
    var fileName = file.name;

    var ext = fileName.substr(fileName.length - 3);

    if (ext == 'pdf') {
      $scope.data.name = file.name;
      document.getElementById('Name').value = file.name;
    } else {
      $scope.result.error= 'Please Select PDF only';
      document.getElementById('uploadFile').value = "";
      $scope.data.name ='No file selected';
    }
  };

  $scope.loadTags = function ($query) {
    var deferred = $q.defer();
    var tags = $filter('filter')($scope.tags, {'name':$query});

    deferred.resolve(tags);
    return deferred.promise;
  };

  $scope.submit = function () {
    GAPIServices.login().then(function () {
      var allFiles = document.getElementById('uploadFile').files;
      var file = allFiles[0];

      $scope.newtagsModel = $scope.tagsModel.map(function (tag) {return tag.name;});

      if ($scope.data.ID == 0) {
        if (document.getElementById('Name').value != '') {
          if ($scope.newtagsModel.length != 0) {
            $scope.data = {action:'add', ID:$scope.data.ID, folderID:$scope.data.folderID, docID:$scope.data.docID, name:$scope.data.name, desc:$scope.data.desc, tags:$scope.newtagsModel, fileID:randomString(8), isAuth:$scope.data.isAuth};
            DataServices.Submit('doJDocs', $scope.data, function (response) {
              $scope.result.notify = 'Saving Record...';
              if (response.success != undefined) {
                //uploading file in google drive
                GAPIServices.upload(file, file.name, $scope.folderTitle).then(function (gapiResponse) {
                  $scope.result.notify = 'Uploading File...';
                  if (gapiResponse.id != undefined) {
                    $scope.data = {action:'rename', ID:$scope.data.ID, folderID:$scope.data.subheadID, docID:response.data.newDocID, name:gapiResponse.title, desc:$scope.data.desc, tags:$scope.newtagsModel, fileID:gapiResponse.id, isAuth:$scope.data.isAuth};
                    $scope.data.name = response.data.newDocID + ' - ' + $scope.data.name;
                    DataServices.Submit('doJDocs', $scope.data, function (response) {
                      $scope.result = response;
                    });
                    //rename filename with docId & abbr
                    GAPIServices.rename(gapiResponse.id, $scope.data.name, function (response) {});
                  } else {
                    $scope.result.error = 'Error while uploading file in drive';
                  }
                });
              } else {
                $scope.result = response;
              }
            });
          } else {
            $scope.result = {error:'Please Select tags'};
          }
        } else {
          $scope.result = {error:'Please Browse file'};
        }
      } else {
        if ($scope.newtagsModel.length != 0) {
          $scope.data = {action:'update', ID:$scope.data.ID, folderID:$scope.data.folderID, docID:$scope.data.docID, name:$scope.data.name, desc:$scope.data.desc, tags:$scope.newtagsModel, fileID:$scope.data.fileID, isAuth:$scope.data.isAuth};
          DataServices.Submit('doJDocs', $scope.data, function(response) {
            $scope.result = response;
          });
        } else {
          $scope.result.error = "Please Select tags";
        }
      }
    });
  };

  $scope.edit = function (id) {
    $scope.result = {};
    DataServices.Edit('jDocs', id, function (response) {
      $scope.data = response;
      $scope.$broadcast('angucomplete-alt:changeInput', 'SubFolder', $filter('filter')($scope.subFolders, {'id': $scope.data.folderID}, true)[0]);

      var tags = response.tags.split(";");
      var newTags = [];
      for (var i = 0; i < tags.length; i++) {
        newTags.push({'id':i, 'name':tags[i]});
      }

      $scope.tagsModel = newTags;
    });
  };

  $scope.reset = function () {
    $scope.data = {ID:0, folderID:0, docID:'OD' + randomString(8), name:'', desc:'', tags:'', fileID:randomString(8), isAuth:0};
    $scope.tags = {};
    $scope.tagsModel = [];
    $scope.$broadcast('angucomplete-alt:clearInput');
    loadTags();
    document.getElementById('uploadFile').value = '';
  };

  function loadTags() {
    DataServices.SelectData('Tags', 'name', function (response) {
      $scope.tags = response;
    });
  }
}]) // upload-doc

// odms/views/auth-docs.html
.controller('AuthDocsCtrl', ['GAPIServices', 'DataServices', '$scope', function (GAPIServices, DataServices, $scope) {
  //--------------------Select Subheads----------------------------
  DataServices.SelectData('SubFolders', 'name', function(response) {
    $scope.subFolders = response;
    $scope.selectedSubFolder = $scope.subFolders[0];
    $scope.selectSubFolder = function(selected) {
      if(selected) {
        $scope.subFolderID = selected.id;
        $scope.folderID = selected.folderID;
      }
    };
  });
  //----------------------------------------------------------------

  bindGrid();

  $scope.checked = function (doc) {
    var para = {action:'authorize', ID:doc.ID, folderID:'', docID:'', name:'', desc:'', tags:'', fileID:'', isAuth:doc.isAuth};
    DataServices.Submit('doJDocs', para, function (response) {
      var resp = response;
    });
  };

  $scope.move = function (doc) {
    GAPIServices.login().then(function () {
      var para = {action:'move', ID:doc.ID, folderID:$scope.subFolderID, docID:'', name:'', desc:'', tags:'', fileID:'', isAuth:0};
      DataServices.Submit('doJDocs', para, function (response) {
        if (response.success != undefined) {
          GAPIServices.copy(doc.fileID, $scope.folderID, function (gapiResponse) {
            if (gapiResponse.id != undefined) {
              var para = {action:'rename', ID:0, folderID:'', docID:doc.docID, name:doc.name, desc:'', tags:'', fileID:gapiResponse.id, isAuth:0};
              DataServices.Submit('doJDocs', para, function (response) {
                bindGrid();
              });
            } else {
              console.error("Error while moving file to drive");
            }
          });
        } else {
          console.error("Error while saving record");
        }
      });
    });
  };

  $scope.delete = function (doc) {
    if (confirm("Do you want to delete this file?")) {
      GAPIServices.login().then(function () {
        var para = {action:'delete', ID:doc.ID, folderID:'', docID:'', name:'', desc:'', tags:'', fileID:'', isAuth:0};
        DataServices.Submit('doJDocs', para, function(response) {
          if(response.success != undefined) {
            GAPIServices.deleteFile(doc.fileID);
            bindGrid();
          } else {
            console.error("Error while deleting record");
          }
        });
      });
    }
  };

  function bindGrid() {
    var para = {tblName:'AuthDocs', searchStr:''};
    DataServices.getData('getSearchData', para, function (response) {
      $scope.docs = response;
    });
  }
}]) // auth-docs

// odms/views/download-docs.html
.controller('downloadDocsCtrl', ['DataServices', '$scope', '$sce', function (DataServices, $scope, $sce) {
  $scope.data = {};
  $scope.btnName = "View";

  $scope.view = function () {
    if($scope.btnName =="Reset") {
      $scope.data = {};
      $scope.btnName = "View";
      $scope.$broadcast('angucomplete-alt:clearInput');
      $scope.files = [];
     } else {
      var para = {tblName:'jDocs', searchStr:''};
      DataServices.getData('getSearchData', para, function (response) {
        $scope.files = response;
        $scope.btnName = "Reset";
      });
    }
  };

  $scope.download = function () {
    $scope.allWebContentLink = [];

    for (var i in $scope.files) {
      if($scope.files[i].checked == true) {
        $scope.webContentLink = 'https://drive.google.com/uc?id='+$scope.files[i].fileID+'&export=download';
        $scope.allWebContentLink.push($scope.webContentLink);
      }
    }
    downloadAll($scope.allWebContentLink);
  };

  function downloadAll(urls) {
    var link = document.createElement('a');
    link.setAttribute('download', null);
    link.style.display = 'none';

    document.body.appendChild(link);

    for (var i in urls) {
      link.setAttribute('href', urls[i]);
      link.click();
    }

    document.body.removeChild(link);
  }

  $scope.highlight = function(text, search) {
    if (!search) {
      return $sce.trustAsHtml(text);
    }

    return $sce.trustAsHtml(text.replace(new RegExp(search, 'gi'), '<span style="background-color:#ff9;">$&</span>'));
  };
}]) // download-docs.html

// odms/views/view-docs.html
.controller('ViewDocsCtrl', ['$q', 'GAPIServices', 'DataServices', '$sce', '$rootScope', '$scope', '$filter','$window', function ($q, GAPIServices, DataServices, $sce, $rootScope, $scope, $filter, $window) {
  $scope.reportTitle = '';
  $scope.reportDate = getCurrentDate();
  $scope.deleteFolderName = '';
  $scope.fieldList = [];

  setTimeout(function() {
    // initialize first time
    var vpw = $(window).width();
    var vph = $(window).height();

    document.getElementById("subFolders-container").style.height = vph - 250 + "px";
    document.getElementById("doc-container").style.height = vph - 100 + "px";

    window.onresize = function () {
      var vpw = $(window).width();
      var vph = $(window).height();

      document.getElementById("subFolders-container").style.height = vph - 250 + "px";
      document.getElementById("doc-container").style.height = vph - 100 + "px";
    };
  }, 1);

  bindFolders();
  bindSubFolders();

  function bindFolders() {
    var para = {tblName:'Folders', coloumnName:''};
    DataServices.getData('getSearchData',para, function(response) {
      $scope.folders = response;
    });
  }

  function bindSubFolders() {
    var para = {tblName:'Sub-Folders', coloumnName:''};
    DataServices.getData('getSearchData', para, function(response) {
      $scope.subFolders = response;
    });
  }

  $scope.viewSubFoldersList = function(folderid) {
    $scope.searchStr = '';
    $scope.subFolderData = [];
    $scope.reportTitle = $filter('filter')($scope.folders, {'ID':folderid}, true)[0].name;
    $scope.subFoldersList = $filter('filter')($scope.subFolders, {'parentID':folderid});

    ViewSubFolder(folderid);
  };

  $scope.checkAll = function() {
    for (var i in $scope.data) {
      if ($scope.selectAll == true) {
        $scope.data[i].checked = true;
      } else {
        $scope.data[i].checked = false;
      }
    }
  };

  $scope.view = function (subFolder) {
    $scope.searchStr = '';
    $scope.bindDeletedSubFolders = subFolder;

    var para = {subheadID:subFolder.ID};
    DataServices.getData('viewDocs', para, function (response) {
      if(response.length){
        $scope.data = response;
        $scope.noFiles = false;
      } else {
        $scope.noFiles = true;
      }
    });
  };

  $scope.highlight = function (text, search) {
    if (!search) {
      return $sce.trustAsHtml(text);
    }
    return $sce.trustAsHtml(text.replace(new RegExp(search, 'gi'), '<span style="background-color:#FF9;">$&</span>'));
  };

  $scope.print = function () {
    window.print();
  };

  $scope.download = function () {
    $scope.allWebContentLink = [];
    for (var i in $scope.data) {
      if ($scope.data[i].checked == true) {
        $scope.webContentLink = 'https://drive.google.com/uc?id='+$scope.data[i].fileID+'&export=download';
        $scope.allWebContentLink.push($scope.webContentLink);
      }
    }

    downloadAll($scope.allWebContentLink);
  };

  function downloadAll(urls) {
    var link = document.createElement('a');
    link.setAttribute('download', null);
    link.style.display = 'none';

    document.body.appendChild(link);

    for (var i in urls) {
      link.setAttribute('href', urls[i]);
      link.click();
    }

    document.body.removeChild(link);
  }

function ViewSubFolder(folderid) {
  $scope.data = [];
  var Header = [];
  var tableJson = [];
  var folderFieldList = ($filter('filter')($scope.folders,{'ID':folderid})[0].fieldList);
  $scope.subFolderJson = $filter('filter')($scope.subFolders, {'parentID': folderid}, true);

    $scope.noFiles = false;

    //binding Header from folders
    if(folderFieldList) {
      folderFieldList = folderFieldList.split("#");
      //bind Header
      for (var i = 0; i < folderFieldList.length; i++) {
        Header.push({'name':folderFieldList[i]});
      }
      $scope.fieldListHeader = Header; //defined header so that it can be used to bind
    } else {
      $scope.fieldListHeader = [];
    }

    //Binding the subFolder field listData
    if($scope.subFolderJson.length) {
      /* jshint -W004 */
      for (var i = 0; i < $scope.subFolderJson.length; i++) {
        if($scope.subFolderJson[i].fieldList){
          var value = $scope.subFolderJson[i].fieldList.split(";");
          var fieldListValue = [];

          //if length of subFolder fieldList matches the length of coloumns of folder
          if( value.length == folderFieldList.length){
            for (var j = 0; j < value.length; j++){
              fieldListValue.push(value[j]);
            }
            tableJson.push({"ID":$scope.subFolderJson[i].ID ,"name":$scope.subFolderJson[i].name, "desc":$scope.subFolderJson[i].desc, "fieldList":fieldListValue});
          }else{
            value[1] = '<i>No of column doesnt maches, Please check the data</i>';
            fieldListValue.push(value[1]);
            tableJson.push({"ID":$scope.subFolderJson[i].ID ,"name":$scope.subFolderJson[i].name, "desc":$scope.subFolderJson[i].desc, "fieldList":fieldListValue});
          }
        } else {
          //if the folder has a Feildlist then
          if($scope.fieldListHeader) {
            var value = [];
            var fieldListValue = [];
            for (var j = 0; j < $scope.fieldListHeader.length; j++) {
              value[j] = ' ';
              fieldListValue.push(value[j]);
            }
            tableJson.push({"ID":$scope.subFolderJson[i].ID ,"name":$scope.subFolderJson[i].name, "desc":$scope.subFolderJson[i].desc, "fieldList":fieldListValue});
          } else {
            tableJson.push({"ID":$scope.subFolderJson[i].ID ,"name":$scope.subFolderJson[i].name, "desc":$scope.subFolderJson[i].desc});
          }
        }
      }
      $scope.subFolderData = tableJson;
    } else {
      $scope.noFiles = true;
    }
  }

  $scope.trash = function() {
    GAPIServices.login().then(function() {
      for(var i in $scope.data) {
        if($scope.data[i].checked == true) {
          if (confirm("Are you sure you want to move " + $scope.data[i].name  +"to Trash.") == true) {
            /* jshint -W083 */
            GAPIServices.trashFile($scope.data[i].fileID).then(function(gapiResponse) {
              // $scope.result.notify = 'Moving folder to trash ...';
              if(gapiResponse.id){
                $scope.trashdata={ID:$scope.data[i].ID, userId:$rootScope.globals.currentUser.ID};
                DataServices.Submit('doJDocsTrash', $scope.trashdata, function(response) {
                  $scope.view($scope.bindDeletedSubFolders);//to bind the files.
                });
              } else {
                console.log(gapiResponse);
              }
            }); //gapiServices.trashFile
          }
        }
      }
    }); //trash
  };
}]) //view-docs.html

//odms/views/search-docs.html
.controller('SearchDocsCtrl', ['DataServices', '$sce', '$scope', function (DataServices, $sce, $scope) {
  $scope.data = {};

  setTimeout(function() {
    // initialize first time
    var vpw = $(window).width();
    var vph = $(window).height();

    document.getElementById("doc-container").style.height = vph - 100 + "px";

    window.onresize = function () {
      var vpw = $(window).width();
      var vph = $(window).height();

      document.getElementById("doc-container").style.height = vph - 100 + "px";
    };
  }, 1);

  $scope.view = function (searchStr) {
    var para = {searchStr:searchStr};
    DataServices.getData('searchDocs', para, function (response) {
      $scope.data = response;
      $scope.showNoFiles = true;
    });
  };

  $scope.viewOnEnter = function (keyEvent) {
    if (keyEvent.which === 13) {
      $scope.view();
    }
  };

  $scope.download = function () {
    $scope.allWebContentLink = [];
    for (var i in $scope.data) {
      if ($scope.data[i].checked == true) {
        $scope.webContentLink = 'https://drive.google.com/uc?id='+$scope.data[i].fileID+'&export=download';
        $scope.allWebContentLink.push($scope.webContentLink);
      }
    }
    downloadAll($scope.allWebContentLink);
  };

  $scope.checkAll = function () {
    for (var i in $scope.data) {
      if ($scope.selectAll == true) {
        $scope.data[i].checked = true;
      } else {
        $scope.data[i].checked = false;
      }
    }
  };

  $scope.highlight = function (text, search) {
    if (!search) {
      return $sce.trustAsHtml(text);
    }
    return $sce.trustAsHtml(text.replace(new RegExp(search, 'gi'), '<span style="background-color:#FF9;">$&</span>'));
  };

  function downloadAll(urls) {
    var link = document.createElement('a');
    link.setAttribute('download', null);
    link.style.display = 'none';

    document.body.appendChild(link);

    for (var i in urls) {
      link.setAttribute('href', urls[i]);
      link.click();
    }

    document.body.removeChild(link);
  }
}]); //search-docs.html
})();
