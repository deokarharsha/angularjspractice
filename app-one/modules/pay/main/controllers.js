(function() {
'use strict';

angular.module('Payroll')

/**
* @ngdoc controller
* @name Main.controller:CompanyCtrl
* @description
* <strong>Database: <span style="color: orange">Payroll</span>
* Table: <span style="color: orange">Companies</span>
* Type: <span style="color: magenta">Master</span></strong>
*
* <strong>View: <span style="color: green">&lt;root&gt;/modules/pay/main/views/company.html</span></strong>
*
* <strong>Dependancies:</strong> <span class="label label-success">DataServices</span>&nbsp;
* <span class="label label-info">$scope</span>&nbsp;<span class="label label-info">$filter</span>
*/
.controller('CompanyCtrl', ['DataServices', '$scope', '$filter', function(DataServices, $scope, $filter) {
  $scope.data = {ID:0, name:'', address:'', cityID:0 , stateID:0, pinCode:'', panNo:'', tanNo:'', directorName:'', directorFName:'', directorDsgn:''};

  /**
  * @ngdoc method
  * @name DataServices SelectData
  * @methodOf Main.controller:CompanyCtrl
  * @description
  * Creates <span class="label label-info">$scope.cities</span> object and
  * bind to <span class="label label-success">angucomplete-alt</span> input text element for autosuggesting.
  *
  * @param {string} tableName Cities
  * @param {string} sortOrder name
  * @param {function} callback returns response object
  */
  DataServices.SelectData('Cities', 'name', function(response) {
    $scope.cities = response;
    $scope.selectedCity = function(selected) {
      if (selected) {
       $scope.data.cityID = selected.originalObject.id;
     }
    };
  });

  /**
  * @ngdoc method
  * @name DataServices SelectData
  * @methodOf Main.controller:CompanyCtrl
  * @description
  * Creates <span class="label label-info">$scope.states</span> object and
  * bind to <span class="label label-success">angucomplete-alt</span> input text element for autosuggesting.
  *
  * @param {string} tableName States
  * @param {string} sortOrder name
  * @param {function} callback returns response object
  */
  DataServices.SelectData('States', 'name', function(response) {
    $scope.states = response;
    $scope.selectedState = function(selected) {
      if (selected) {
        $scope.data.stateID = selected.originalObject.id;
      }
    };
  });

  /**
  * @ngdoc method
  * @name submit
  * @methodOf Main.controller:CompanyCtrl
  * @description
  * Calls <span class="label label-success">DataServices.Submit()</span> method to save/update data.
  *
  * <strong>Stored Procedure: <span style="color: orange">doComapnies</span>
  *
  * Response: <span style="color: darkblue">id</span></strong>
  */
  $scope.submit = function () {
    DataServices.Submit('doCompanies', $scope.data, function(response) {
      $scope.result = response;
    });
  };

  /**
  * @ngdoc method
  * @name edit
  * @methodOf Main.controller:CompanyCtrl
  * @description
  * Calls <span class="label label-success">DataServices.Edit()</span> method to get single record for edit/view.
  *
  * @param {number} id id
  */
  $scope.edit = function(id) {
    $scope.result = {};
    DataServices.Edit('Companies', id, function(response) {
      $scope.data = response;

      $scope.$broadcast('angucomplete-alt:changeInput', 'Cities', $filter('filter')($scope.cities, {'id': $scope.data.cityID}, true)[0]);
      $scope.$broadcast('angucomplete-alt:changeInput', 'States', $filter('filter')($scope.states, {'id': $scope.data.stateID}, true)[0]);
    });
  };

  /**
  * @ngdoc method
  * @name reset
  * @methodOf Main.controller:CompanyCtrl
  * @description
  * Reset all the form elements along with <span class="label label-success">angucomplete-alt</span> input text elements.
  */
  $scope.reset = function() {
    $scope.data = {ID:0, name:'', address:'', cityID:0 , stateID:0, pinCode:'', panNo:'', tanNo:'', directorName:'', directorFName:'', directorDsgn:''};
    $scope.$broadcast('angucomplete-alt:clearInput');
    };
}]) // company

/**
* @ngdoc controller
* @name Main.controller:DivisionCtrl
* @description
* <strong>Database: <span style="color: orange">Payroll</span>
* Table: <span style="color: orange">Divisions</span>
* Type: <span style="color: magenta">Master</span></strong>
*
* <strong>View: <span style="color: green">&lt;root&gt;/modules/pay/main/views/division.html</span></strong>
*
* <strong>Dependancies:</strong> <span class="label label-success">DataServices</span>&nbsp;
* <span class="label label-info">$scope</span>&nbsp;<span class="label label-info">$filter</span>
*/
.controller('DivisionCtrl', ['DataServices', '$rootScope', '$scope', '$filter', function(DataServices, $rootScope, $scope, $filter) {
  $scope.data = {ID:0, coID:0, name:'', prefixCode:'', address:'', cityID:0 , stateID:0, pinCode:'', pfNo:'', esicNo:'', ptaxNo:'', licNo:'', licFreq:'', licCategory:''};

  /**
  * @ngdoc method
  * @name DataServices SelectData
  * @methodOf Main.controller:DivisionCtrl
  * @description
  * Creates <span class="label label-info">$scope.companies</span> object and
  * bind to select element for selecting one.
  *
  * @param {string} tableName Companies
  * @param {string} sortOrder name
  * @param {function} callback returns response object
  */
  DataServices.SelectData('Companies', 'name', function(response) {
    $scope.companies = response;
    $scope.selectedCompany = $scope.companies[0];
    $scope.selectCompany = function(selected) {
      $scope.data.coID = selected.id;
    };
  });

  /**
  * @ngdoc method
  * @name DataServices SelectData
  * @methodOf Main.controller:DivisionCtrl
  * @description
  * Creates <span class="label label-info">$scope.cities</span> object and
  * bind to <span class="label label-success">angucomplete-alt</span> input text element for autosuggesting.
  *
  * @param {string} tableName Cities
  * @param {string} sortOrder name
  * @param {function} callback returns response object
  */
  DataServices.SelectData('Cities', 'name', function(response) {
    $scope.cities = response;
    $scope.selectedCity = function(selected) {
      if (selected) {
       $scope.data.cityID = selected.originalObject.id;
      }
    };
  });

  /**
  * @ngdoc method
  * @name DataServices SelectData
  * @methodOf Main.controller:DivisionCtrl
  * @description
  * Creates <span class="label label-info">$scope.states</span> object and
  * bind to <span class="label label-success">angucomplete-alt</span> input text element for autosuggesting.
  *
  * @param {string} tableName States
  * @param {string} sortOrder name
  * @param {function} callback returns response object
  */
  DataServices.SelectData('States', 'name', function(response) {
    $scope.states = response;
    $scope.selectedState = function(selected) {
      if (selected) {
        $scope.data.stateID = selected.originalObject.id;
      }
    };
  });

  /**
  * @ngdoc method
  * @name submit
  * @methodOf Main.controller:DivisionCtrl
  * @description
  * Calls <span class="label label-success">DataServices.Submit()</span> method to save/update data.
  *
  * <strong>Stored Procedure: <span style="color: orange">doDivisions</span>
  *
  * Response: <span style="color: darkblue">id</span></strong>
  */
  $scope.submit = function() {
    DataServices.Submit('doDivisions', $scope.data, function(response) {
      $scope.result = response;
    });
  };

  /**
  * @ngdoc method
  * @name edit
  * @methodOf Main.controller:DivisionCtrl
  * @description
  * Calls <span class="label label-success">DataServices.Edit()</span> method to get single record for edit/view.
  *
  * @param {number} id id
  */
  $scope.edit = function(id) {
    $scope.result = {};
    DataServices.Edit('Divisions', id, function(response) {
      $scope.data = response;
      $scope.selectedCompany = $filter('filter')($scope.companies, {'id': $scope.data.coID})[0];
      $scope.$broadcast('angucomplete-alt:changeInput', 'Cities', $filter('filter')($scope.cities, {'id': $scope.data.cityID}, true)[0]);
      $scope.$broadcast('angucomplete-alt:changeInput', 'States', $filter('filter')($scope.states, {'id': $scope.data.stateID}, true)[0]);
    });
  };

  /**
  * @ngdoc method
  * @name reset
  * @methodOf Main.controller:DivisionCtrl
  * @description
  * Reset all the form elements along with <span class="label label-success">angucomplete-alt</span> input text elements.
  */
  $scope.reset = function() {
    $scope.data = {ID:0, coID:0, name:'', prefixCode:'', address:'', cityID:0 , stateID:0, pinCode:'', pfNo:'', esicNo:'', ptaxNo:'', licNo:'', licFreq:'', licCategory:''};
    $scope.$broadcast('angucomplete-alt:clearInput');
    $scope.selectedCompany = $scope.companies[0];
  };
}]) // division

/**
* @ngdoc controller
* @name Main.controller:HolidaysCtrl
* @description
* <strong>Database: <span style="color: orange">Payroll</span>
* Table: <span style="color: orange">Holidays</span>
* Type: <span style="color: magenta">Master</span></strong>
*
* <strong>View: <span style="color: green">&lt;root&gt;/modules/pay/main/views/holidays.html</span></strong>
*
* <strong>Dependancies:</strong> <span class="label label-success">DataServices</span>&nbsp;
* <span class="label label-info">$scope</span>&nbsp;<span class="label label-info">$filter</span>
*/
.controller('HolidaysCtrl', ['DataServices', '$scope', '$filter', function(DataServices, $scope, $filter) {
  $scope.data = {ID:0};
  bindGrid();


  /**
  * @ngdoc method
  * @name save
  * @methodOf Main.controller:HolidaysCtrl
  * @description
  * Calls <span class="label label-success">DataServices.Submit()</span> method to save/update data.
  *
  * <strong>Stored Procedure: <span style="color: orange">doHolidays</span>
  *
  * Call <span style="color : green">bindGrid()</span> method

  * Response: <span style="color: darkblue">id</span></strong>
  */
  $scope.save = function(para) {
    DataServices.Submit('doHolidays', para, function(response) {
      $scope.result = response;
      bindGrid();
      $scope.data = {ID:0};
    });
  };
  /**
  * @ngdoc method
  * @name setEditMode
  * @methodOf Main.controller:HolidaysCtrl
  * @description
  * <strong>setEditMode</strong> method used to edit the single record from table..
  */
  $scope.setEditMode = function(value) {
    $scope.editMode = value;
  };

  function bindGrid() {
    var para = {tblName:'Holidays', searchStr:''};
    DataServices.getData('getSearchData', para, function(response) {
      $scope.holidays = response;
      for(var i=0; i<$scope.holidays.length;i++) {
        $scope.holidays[i].date = $filter('date')(parseInt($scope.holidays[i].date.substr(6,13)), 'dd/MM/yyyy') ;
      }
    });
  }
}]) // holidays

/**
* @ngdoc controller
* @name Main.controller:MasterCtrl
* @description
* <strong>Database: <span style="color: orange">Payroll</span>
* Table: <span style="color: orange">Master</span>
* Type: <span style="color: magenta">Master</span></strong>
*
* <strong>View: <span style="color: green">&lt;root&gt;/modules/pay/main/views/master.html</span></strong>
*
* <strong>Dependancies:</strong> <span class="label label-success">DataServices</span>&nbsp;
* <span class="label label-info">$rootscope</span>&nbsp;<span class="label label-info">$scope</span>
*/
// pay/main/views/master.html  dept, dsgn, grade
.controller('MasterCtrl', ['DataServices', '$rootScope', '$scope', function(DataServices, $rootScope, $scope) {
  $scope.data = {ID:0};

  /**
  * @ngdoc method
  * @name submit
  * @methodOf Main.controller:MasterCtrl
  * @description
  * Calls <span class="label label-success">DataServices.Submit()</span> method to save/update data.
  *
  * <strong>Stored Procedure: <span style="color: orange">doMaster</span>
  *
  * Response: <span style="color: darkblue">id</span></strong>
  */
  $scope.submit = function() {
    $scope.data = {tblName:$scope.contents[$rootScope.currentModuleId].tblName, ID:$scope.data.ID, name:$scope.data.name, desc:$scope.data.desc};
    DataServices.Submit('doMaster', $scope.data, function(response) {
      $scope.result = response;
    });
  };
  /**
  * @ngdoc method
  * @name edit
  * @methodOf Main.controller:MasterCtrl
  * @description
  * Calls <span class="label label-success">DataServices.Edit()</span> method to get single record for edit/view.
  *
  * @param {number} id id
  */
  $scope.edit = function(id) {
    $scope.result = {};
    DataServices.Edit($scope.contents[$rootScope.currentModuleId].tblName, id, function(response) {
      $scope.data = response;
    });
  };
  /**
  * @ngdoc method
  * @name reset
  * @methodOf Main.controller:MasterCtrl
  * @description
  * Reset all the form elements along with <span class="label label-success">angucomplete-alt</span> input text elements.
  */
  $scope.reset = function() {
    $scope.data = {ID:0};
  };
}]) // master


/**
* @ngdoc controller
* @name Main.controller:ShiftsCtrl
* @description
* <strong>Database: <span style="color: orange">Payroll</span>
* Table: <span style="color: orange">Shifts</span>
* Type: <span style="color: magenta">Master</span></strong>
*
* <strong>View: <span style="color: green">&lt;root&gt;/modules/pay/main/views/shift.html</span></strong>
*
* <strong>Dependancies:</strong> <span class="label label-success">DataServices</span>&nbsp;
* <span class="label label-info">$scope</span>
*/
// pay/main/views/shift.html
.controller('ShiftsCtrl', ['DataServices', '$scope', function(DataServices, $scope) {
  $scope.data = {ID:0, name:'', code:'', inTime:'', outTime:'', nextDayOut:0};
  bindGrid();
  /**
  * @ngdoc method
  * @name save
  * @methodOf Main.controller:ShiftsCtrl
  * @description
  * Calls <span class="label label-success">DataServices.Submit()</span> method to save/update data.
  *
  * <strong>Stored Procedure: <span style="color: orange">doShifts</span>
  *
  * Call <span style="color : green">bindGrid()</span> method

  * Response: <span style="color: darkblue">id</span></strong>
  */
  $scope.save = function(para) {
    DataServices.Submit('doShifts', para, function(response) {
      $scope.result = response;
      bindGrid();
      $scope.data = {ID:0, name:'', code:'', inTime:'', outTime:'', nextDayOut:0};
    });
  };
  /**
  * @ngdoc method
  * @name setEditMode
  * @methodOf Main.controller:ShiftsCtrl
  * @description
  * <strong>setEditMode</strong> method used to edit the single record from table..
  */
  $scope.setEditMode = function(value) {
    $scope.editMode = value;
  };

  function bindGrid() {
    var para = {tblName:'Shifts', searchStr:''};
    DataServices.getData('getSearchData', para, function(response) {
      $scope.shifts = response;
    });
  }
}]) // shift


/**
* @ngdoc controller
* @name Main.controller:SlabCtrl
* @description
* <strong>Database: <span style="color: orange">Payroll</span>
* Table: <span style="color: orange">Slab</span>
* Type: <span style="color: magenta">Master</span></strong>
*
* <strong>View: <span style="color: green">&lt;root&gt;/modules/pay/main/views/slab.html</span></strong>
*
* <strong>Dependancies:</strong> <span class="label label-success">DataServices</span>&nbsp;
* <span class="label label-info">$rootScope</span>&nbsp;<span class="label label-info">$scope</span>
*/
// pay/main/views/slab.html PT, LWF
.controller('SlabCtrl', ['DataServices', '$rootScope', '$scope', function(DataServices, $rootScope, $scope) {
  $scope.data = {ID:0};
  $scope.slabs = [];
  /**
  * @ngdoc method
  * @name DataServices SelectData
  * @methodOf Main.controller:SlabCtrl
  * @description
  * Creates <span class="label label-info">$scope.states</span> object and
  * bind to <span class="label label-success">angucomplete-alt</span> input text element for autosuggesting.
  *
  * @param {string} tableName States
  * @param {string} sortOrder name
  * @param {function} callback returns response object
  */
  // auto complete get states
  DataServices.SelectData('States', 'Name', function(response) {
    $scope.states = response;
    $scope.selectedState = function(selected) {
      if (selected) {
        $scope.stateID = selected.originalObject.id;
        bindGrid();
      }
    };
  });
  /**
  * @ngdoc method
  * @name save
  * @methodOf Main.controller:SlabCtrl
  * @description
  * Calls <span class="label label-success">DataServices.Submit()</span> method to save/update data.
  *
  * <strong>Stored Procedure: <span style="color: orange">doSlab</span>
  *
  * Call <span style="color : green">bindGrid()</span> method

  * Response: <span style="color: darkblue">id</span></strong>
  */
  $scope.save = function(para) {
    para = {tblName:$scope.contents[$rootScope.currentModuleId].tblName, ID:para.ID, stateID:$scope.data.stateID, fromAmt:para.fromAmt, toAmt:para.toAmt, deduction:para.deduction};
    DataServices.Submit('doSlab', para , function(response) {
      $scope.result = response;
      bindGrid();
      $scope.data = {ID:0};
    });
  };
  /**
  * @ngdoc method
  * @name reset
  * @methodOf Main.controller:SlabCtrl
  * @description
  * Reset all the form elements along with <span class="label label-success">angucomplete-alt</span> input text elements.
  */
  $scope.reset = function() {
    $scope.data = {ID:0};
    $scope.$broadcast('angucomplete-alt:clearInput');
    $scope.slabs = [];
  };
  /**
  * @ngdoc method
  * @name setEditMode
  * @methodOf Main.controller:SlabCtrl
  * @description
  * <strong>setEditMode</strong> method used to edit the single record from table..
  */
  $scope.setEditMode = function(value) {
    $scope.editMode = value;
  };

  function bindGrid() {
    var para = {tblName:$scope.contents[$rootScope.currentModuleId].tblName, searchStr:''};
    DataServices.getData('getSearchData', para, function(response) {
      $scope.slabs = response;
      // $scope.slabs = [];
      // for(var i=0; i < $scope.slabs2.length;i++) {
      //   if ($scope.slabs2[i].stateID == stateid) {
      //     $scope.slabs.push($scope.slabs2[i]);
      //   }
      // }
   });
  }
}]) // slab

// pay/main/views/emp.html
/**
 * @ngdoc controller
 * @name Main.controller:EmployeesCtrl
 * @description
 * <strong>Database: <span style="color: orange">Payroll</span>
 * Table: <span style="color: orange">Employees</span>
 * Type: <span style="color: magenta">Master</span></strong>
 *
 * <strong>View: <span style="color: green">&lt;root&gt;/modules/pay/main/views/emp.html</span></strong>
 *
 * <strong>Dependancies:</strong> <span class="label label-success">DataServices</span>&nbsp;
 * <span class="label label-info">$rootScope</span>&nbsp;<span class="label label-info">$scope</span>
 */
.controller('EmployeesCtrl', ['DataServices', '$scope', '$filter', function (DataServices, $scope, $filter) {
  $scope.data = {
    ID: 0,
    empID: '',
    cardID: '',
    status: 'W',
    firstName: '',
    middleName: '',
    lastName: '',
    dob: '',
    gender: '',
    maritalStatus: '',
    roomNo: '',
    location: '',
    street: '',
    area: '',
    cityID: 0,
    stateID: 0,
    pinCode: '',
    nRoomNo: '',
    nLocation: '',
    nStreet: '',
    nArea: '',
    nCityID: 0,
    nStateID: 0,
    nPinCode: '',
    resTel: '',
    mobile: '',
    emgTel: '',
    email: '',
    bloodGroup: '',
    doj: '',
    coID: 1,
    divID: 1,
    deptID: 0,
    dsgnID: 0,
    gradeID: 0,
    pan: '',
    isHandicapped: 0,
    isPT: 0,
    isPF: 0,
    pfNo: '',
    isESIC: 0,
    esicNo: '',
    isLWF: 0,
    lwfNo: '',
    licNo: '',
    dol: '',
    bank: '',
    branch: '',
    bCityID: 0,
    bStateID: 0,
    bAcNo: '',
    ifsc: '',
    photo: '',
    aadharNo: '',
    uanAno: ''
  };
  $scope.nominees = [];

  /**
   * @ngdoc method
   * @name DataServices SelectData
   * @methodOf Main.controller:EmployeesCtrl
   * @description
   * Creates <span class="label label-info">$scope.BGs</span> object and
   * bind to <span class="label label-success">angucomplete-alt</span> input text element for autosuggesting.
   *
   * @param {string} Checkboxlist Bgs
   * @param {string} sortOrder name
   * @param {function} callback returns response object
   */

  $scope.BGs = [{
      id: '0',
      name: '-'
    },
    {
      id: '1',
      name: 'A+'
    },
    {
      id: '2',
      name: 'B+'
    },
    {
      id: '3',
      name: 'AB+'
    },
    {
      id: '4',
      name: 'O+'
    },
    {
      id: '5',
      name: 'A-'
    },
    {
      id: '6',
      name: 'B-'
    },
    {
      id: '7',
      name: 'AB-'
    },
    {
      id: '8',
      name: 'O-'
    },
  ];
  $scope.selectedBG = $scope.BGs[0];
  $scope.selectBG = function (selectedBG) {
    $scope.data.bloodGroup = selectedBG.name;
  };
  /**
   * @ngdoc method
   * @name DataServices SelectData
   * @methodOf Main.controller:EmployeesCtrl
   * @description
   * Creates <span class="label label-info">$scope.MSs</span> object and
   * bind to <span class="label label-success">angucomplete-alt</span> input text element for autosuggesting.
   *
   * @param {string} Checkboxlist Maratial Status
   * @param {string} sortOrder name
   * @param {function} callback returns response object
   */

  $scope.MSs = [{
      id: '1',
      name: 'Married'
    },
    {
      id: '2',
      name: 'Unmarried'
    }
  ];
  $scope.selectedMS = $scope.MSs[0];
  $scope.selectMS = function (selectedMS) {
    $scope.data.maritalStatus = selectedMS.name;
  };

  /**
   * @ngdoc method
   * @name DataServices SelectData
   * @methodOf Main.controller:EmployeesCtrl
   * @description
   * Creates <span class="label label-info">$scope.Grades</span> object and
   * bind to <span class="label label-success">angucomplete-alt</span> input text element for autosuggesting.
   *
   * @param {string} Checkboxlist Grades
   * @param {string} sortOrder name
   * @param {function} callback returns response object
   */

  DataServices.SelectData('Grade', 'Name', function (response) {
    $scope.grades = response;
    $scope.selectedGrade = $scope.grades[0];
    $scope.selectGrade = function (selectedGrade) {
      $scope.data.gradeID = selectedGrade.id;
    };
  });

  /**
   * @ngdoc method
   * @name DataServices SelectData
   * @methodOf Main.controller:EmployeesCtrl
   * @description
   * Creates <span class="label label-info">$scope.Cities</span> object and
   * bind to <span class="label label-success">angucomplete-alt</span> input text element for autosuggesting.
   *
   * @param {string} Checkboxlist Cities
   * @param {string} sortOrder name
   * @param {function} callback returns response object
   */

  DataServices.SelectData('Cities', 'Name', function (response) {
    $scope.cities = response;
    $scope.ncities = response;
    $scope.bcities = response;

    $scope.nselectedCity = function (selected) {
      if (selected) {
        $scope.data.nCityID = selected.originalObject.id;
      }
    };
    $scope.bselectedCity = function (selected) {
      if (selected) {
        $scope.data.bCityID = selected.originalObject.id;
      }
    };
    $scope.selectedCity = function (selected) {
      if (selected) {
        $scope.data.cityID = selected.originalObject.id;
      }
    };
  });

  DataServices.SelectData('States', 'name', function (response) {
    $scope.states = response;
    $scope.selectedState = function (selected) {
      if (selected) {
        $scope.stateID = selected.originalObject.id;
        bindGrid();
      }
    };
  });

}]) // Employees


/**
 * @ngdoc controller
 * @name Main.controller:EmpQECtrl
 * @description
 * <strong>Database: <span style="color: orange">Payroll</span>
 * Table: <span style="color: orange">EmployeesQE</span>
 * Type: <span style="color: magenta">Master</span></strong>
 *
 * <strong>View: <span style="color: green">&lt;root&gt;/modules/pay/main/views/emp.html</span></strong>
 *
 * <strong>Dependancies:</strong> <span class="label label-success">DataServices</span>&nbsp;
 * <span class="label label-info">$rootScope</span>&nbsp;<span class="label label-info">$scope</span>
 */
// pay/main/views/emp-qe.html
.controller('EmpQECtrl', ['DataServices', '$rootScope', '$scope', function (DataServices, $rootScope, $scope) {
  $scope.data = [];
  /**
  * @ngdoc method
  * @name DataServices SelectData
  * @methodOf Main.controller:EmpQECtrl
  * @description
  * Creates <span class="label label-info">$scope.fields</span> object and
  * bind to <span class="label label-success">angucomplete-alt</span> input text element for autosuggesting.
  *
  * @param {string} tableName EmployeesQE
  * @param {string} sortOrder name
  * @param {function} callback returns response object
  */
  //-------------------Select Fields-----------------------------
  DataServices.SelectData('EmployeesQE', 'name', function(response) {
    $scope.fields = response;
    $scope.selectedField = $scope.fields[0];

    $scope.selectField = function(selectedField) {
      $scope.data.fieldName = selectedField.name;
      bindGrid();
    };
  });
  //---------------------------------------------------------------
  /**
  * @ngdoc method
  * @name save
  * @methodOf Main.controller:EmpQECtrl
  * @description
  * Calls <span class="label label-success">DataServices.Submit()</span> method to save/update data.
  *
  * <strong>Stored Procedure: <span style="color: orange">doEmployeesQE</span>
  *
  * Response: <span style="color: darkblue">id</span></strong>
  */
  $scope.save = function(emp) {
    var para = {ID:emp.ID, field:$scope.data.fieldName, value:emp.value};

    DataServices.Submit('doEmployeesQE', para, function(response) {
      $scope.result = response;
      bindGrid();
    });
  };
  /**
  * @ngdoc method
  * @name setEditMode
  * @methodOf Main.controller:EmpQECtrl
  * @description
  * <strong>setEditMode</strong> method used to edit the single record from table..
  */
  $scope.setEditMode = function(mode) {
    $scope.editMode = mode;
  };

  function bindGrid() {
    var para = {divID:$rootScope.globals.currentDivision.ID, field:$scope.data.fieldName};
    DataServices.getData('getEmployeesQE', para, function(response) {
      $scope.employees = response;
    });
  }
}]); // emp-qe
})();
