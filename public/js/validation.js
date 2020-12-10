
 function finalcardnumber(inputtxt, inputyp)
{
     var x = document.getElementById("ctype");
    

if(x.value === "01")
{var cardno = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/;
  if(inputtxt.value.match(cardno))
        {
     
      alert("transaction succeeded");
      return true;
  }
      else
        {
        alert("Not a valid Visa credit card number!");
       return false;
     
    }
}
else if(x.value==="02")
{
  var cardno = /^(?:3[47][0-9]{13})$/;
  if(inputtxt.value.match(cardno))
        {
      alert("transaction succeeded");
       return true;
        }
      else
        {
        alert("Not a valid Amercican Express credit card number!");
      return false;
     
        }
}
else if(x.value==="03")
{ var cardno = /^(?:5[1-5][0-9]{14})$/;
  if(inputtxt.value.match(cardno))
        {
      alert("transaction succeeded");
      return true;
        }
      else
        {
        alert("Not a valid Mastercard number!");
      return false;
   
    
        }}

else (x.value=="04")
{  var cardno = /^(?:6(?:011|5[0-9][0-9])[0-9]{12})$/;
  if(inputtxt.value.match(cardno))
        {
      alert("transaction succeeded");
      return true;
        }
      else
        {
        alert("Not a valid Discover card number!");
       return false;
     }
     }
     
}
