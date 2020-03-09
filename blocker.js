let blockedUsers = []

chrome.storage.local.get('blockedUsers', function (result) {
  blockedUsers = result.blockedUsers ? result.blockedUsers : [];
});

$(document).ready(function() {
  hideItems();

    $('.blockUser').click(function(){
      alert('Uživatel byl zablokování. Při dalším načtení stránky se jeho inzeráty nebudou zobrazovat.');
      blockUser( $(this).data("user") );
      return false;
    });

    $('.unblockUser').click(function(){
      alert('Uživatel byl odblokován.');
      unblockUser( $(this).data("user") );
      return false;
    });

    $('.showItem').click(function(){
      $(this).parent().next().slideToggle();
      return false;
    });
});

  
function blockUser(userId) {
  blockedUsers.push(userId);
  chrome.storage.local.set({'blockedUsers': blockedUsers}, function(){
  });
  return false;
}

function unblockUser(userId) {
  for(i=0; i<blockedUsers.length; i++) {
    if(blockedUsers[i]==userId) {
      blockedUsers.splice(i, 1);
    }
  }
  chrome.storage.local.set({'blockedUsers': blockedUsers}, function(){
  });
  return false;
}



function hideItems() {

  $('div.item table.table_info a[href*="/uzivatel/"]').each(function(){

    var userId = $(this).attr("href").match(/\/uzivatel\/([0-9]+)\/.*\//)[1];

    var isUserBlocked = false;

    for(i=0; i<blockedUsers.length; i++) {
      if(blockedUsers[i]==userId) isUserBlocked = true;
    }

    link = isUserBlocked ? '<a href="#" class="unblockUser" data-user="'+userId+'">Odblokovat uživatele</a>' : '<a href="#" class="blockUser" data-user="'+userId+'">Blokovat uživatele</a>';

    $(this).parent().append('<span class="blockedUserAction">&nbsp;&nbsp;|&nbsp;&nbsp;' + link + '</span>');

    if(isUserBlocked) {
      var item = $(this).parents('.item');
      item.hide();
      item.before('<div class="blocked-message clearfix" style="padding: 4px 0;color:#888;">Inzerát zablokovaného uživatele. <a href="#" class="showItem" style="color:#333;">Zobrazit/skrýt inzerát</a></div>')
    }
});
}