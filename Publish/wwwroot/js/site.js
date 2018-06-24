function editFormatter(value, row) {
  return '<button id="btnEdit" class="btn btn-xs btn-default" type="button"><i class="glyphicon glyphicon-pencil"></i></button>';
}

function delFormatter(value, row) {
  return '<button id="btnDel" class="btn btn-xs btn-default" type="button"><i class="glyphicon glyphicon-trash"></i></button>';
}

function checkboxFormatter(value, row) {
  var id = row.Id;
  return '<input type="checkbox" onclick="return false;" ' + (value ? 'checked="checked"' : '') + '>';
}

function highLightRow($tr) {
  //$tr.css('background-color', '#85a1a7').siblings().css('background-color', '');
  $tr.addClass('highlight').siblings().removeClass('highlight');
  $tr.attr('data-highlighted', true).siblings().removeAttr('data-highlighted');
}

function getId($element) {
  var result = $($element).closest('tr').data('uniqueid');
  return result;
}

function deleteItem($table, id) {
  BootstrapDialog.show({
    type: BootstrapDialog.TYPE_WARNING,
    title: 'Please confirm',
    message: 'Delete <strong>' + getCrudName($table, id) + '</strong> ?',
    draggable: true,
    buttons: [{
      label: 'Close',
      action: function (sender) {
        sender.close();
      }
    },
    {
      id: 'btnDelete',
      icon: 'glyphicon glyphicon-trash',
      label: 'Delete',
      cssClass: 'btn-danger',
      hotkey: 13,
      action: function (sender) {
        var $button = this;
        $button.disable();
        $button.spin();
        sender.setClosable(false);

        $.ajax({
          url: 'Delete/' + id,
          type: 'post',
          cache: false,
          success: function (result) {
            if (result.success === true) {
              $table.bootstrapTable('removeByUniqueId', id);
              sender.close();
            }
            else {
              sender.setClosable(true);
              sender.setTitle('Delete Error');
              var btn = sender.getButton('btnDelete');
              btn.stopSpin();
              sender.setMessage('<strong>' + result.errorMessage + '</strong>');
            }
          }
        });
      }
    }
    ]
  });
}

function getCrudName($table, id) {
  var row = $table.bootstrapTable('getRowByUniqueId', id);
  var fieldName = $table.attr('data-crudname');

  if (fieldName === null)
    fieldName = $table.attr('data-unique-id');

  var result = row[fieldName];

  return result;
}

function editDialogHighlighted($table, $tr) {
  if ($tr === undefined)
    $tr = $table.find('tr[data-highlighted="true"]');

  var id = getId($tr);

  if (id !== undefined)
    editDialog($table, id);
}

function editDialog($table, id) {
  var title = 'Add item';

  if (id === undefined) {
    id = '';
  }
  else {
    title = 'Edit <strong>' + getCrudName($table, id) + '</strong>';
  }

  var dlg = new BootstrapDialog({
    type: BootstrapDialog.TYPE_PRIMARY,
    title: title,
    message: 'Loading please wait...',
    draggable: true,
    onshown: function (dialog) {
    },
    buttons: [{
      label: 'Close',
      action: function (sender) {
        sender.close();
      }
    },
    {
      id: 'btnsave',
      label: 'Save',
      icon: 'glyphicon glyphicon-ok',
      cssClass: 'btn-success',
      enabled: false,
      action: function (sender) {
        var $button = this;
        var $form = $('#frmcrud').get(0);

        $('#frmcrud').one('submit', function (e) {
          var formData = $('#frmcrud :input').serialize();
          e.preventDefault();
          $.ajax({
            cache: false,
            url: $form.action,
            type: $form.method,
            data: formData,
            complete: function (msg) {
              $button.enable();
              $button.stopSpin();
              sender.setClosable(true);
            },
            error: function (msg) {
              alert(msg.status + '\n' + msg.statusText);
            },
            success: function (document) {
              if (document.Success) {
                updateGrid($table, document.Model);
                sender.close();
              } else {
                $('#frmcrud').html(document);
              }
            }
          });
        });

        $button.disable();
        $button.spin();
        sender.setClosable(false);

        $('#frmcrud').submit();
      }
    }
    ]
  });

  dlg.open();

  var url = 'Edit/' + id;
  $.ajax({
    url: url,
    type: 'get',
    cache: false,
    context: { dialog: dlg },
    success: function (data) {
      this.dialog.$modalBody.html(data);
      var btn = this.dialog.getButton('btnsave');
      btn.enable();
    }
  });
}

function updateGrid($table, row) {
  var id = row[$table.data('unique-id')];
  var $tr = $table.find("tr[data-uniqueid='" + id + "']");

  if ($tr.length === 0) {
    $table.bootstrapTable('insertRow', { index: 0, row: row });
  }
  else
    $table.bootstrapTable('updateByUniqueId', { id: id, row: row });

  $tr = $table.find("tr[data-uniqueid='" + id + "']");
  highLightRow($tr);
}

/*
function showAlert(alertType, message) {
  $("#crudMsg").append('<div class="alert alert-' + alertType + ' fade-in" id="alert' + containerId + '"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>' + message + '</div>');
  $("#alert" + containerId).alert();
  window.setTimeout(function () {
    $("#alert" + containerId).fadeTo(500, 0).slideUp(500, function () {
      $(this).remove();
    });
  }, 5000);
}
*/

//$('#btnDel').click(function () {
//  var ids = $.map($table.bootstrapTable('getSelections'), function (row) { return row.id; });
//  $table.bootstrapTable('remove', {
//    field: 'id',
//    values: ids
//  });
//});


//  data-query-params="customParams"
//function customParams(p)
//{
//  p.Extra = 2;
//  return p;
//}