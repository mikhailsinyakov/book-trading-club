'use strict';

function UserController() {
   this.deleteAccount = () => {
      const deleteAccountBtn = document.querySelector("#deleteAccount");
      if (deleteAccountBtn) deleteAccountBtn.onclick = () => {
         if (confirm("This action will delete your account, your books and your proposals. Are you sure?")) {
            ajaxFunctions.ready(ajaxFunctions.ajaxRequest("DELETE", "/api/deleteAccount", status => {
                  if (status == 200) location.reload();
            }));
         }
      };
   };
   
}

const userController = new UserController();
