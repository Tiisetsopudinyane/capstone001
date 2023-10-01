
export function dateGenerater(){
   const date=new Date().toLocaleDateString('en-ZA')
   return date
}

export function timeGenerater(){
   const time=new Date().toLocaleTimeString();
   return time
}