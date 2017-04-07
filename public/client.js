function deleteBlock ($this) {
  var $prev = $this.prev();
  var block = $prev.attr('data-block');

  $.ajax({
    type: 'DELETE',
    url: `/blocks/${block}`
  }).always(function () {
    $this.parent().remove();
  });
}

$(document).ready(function () {
  var $listBlocks = $('#list-blocks');

  function Block (key, value) {
    this.key = key;
    this.value = value;

    this.toHTML = function () {
      return `
        <li>
          <a href="/blocks/${this.key}" data-block="${this.key}">
            <strong>${this.key}</strong>: ${this.value}
          </a>
          <span class="delete" onclick="deleteBlock($(this))">DELETE</span>
        </li>
      `;
    };
  }

  $.get('/blocks', function (res) {
    for (var i in res) {
      var key = i;
      var value = res[key];
      var block = new Block(key, value);

      $listBlocks.append(block.toHTML());
    }
  });

  $('form').on('submit', function (e) {
    e.preventDefault();

    var form = $(this);
    var key = $('input[name=key]').val();
    var value = $('input[name=value]').val();

    $.ajax({
      type: 'POST',
      url: `/blocks/${key}`,
      data: JSON.parse(`{ "${key}": "${value}" }`),
      dataType: 'json'
    }).always(function () {
      var block = new Block(key, value);
      $listBlocks.append(block.toHTML());
      form.trigger('reset');
    });
  });
});
