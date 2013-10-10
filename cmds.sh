HOST=http://localhost:1234
curl "${HOST}/nextCommand"; echo;
curl "${HOST}/call?atFloor=3&to=DOWN"; echo;
curl "${HOST}/nextCommand"; echo;
curl "${HOST}/call?atFloor=0&to=UP"; echo;
curl "${HOST}/nextCommand"; echo;
curl "${HOST}/call?atFloor=0&to=UP"; echo;
curl "${HOST}/nextCommand"; echo;
curl "${HOST}/userHasEntered"; echo;
curl "${HOST}/go?floorToGo=0"; echo;
curl "${HOST}/nextCommand"; echo;
curl "${HOST}/nextCommand"; echo;
curl "${HOST}/nextCommand"; echo;
curl "${HOST}/nextCommand"; echo;
curl "${HOST}/nextCommand"; echo;

# floor 0: OUT :1 , floor: IN :2
