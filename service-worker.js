// 게임 모음이 /games/ 로 이사했다. 예전에 루트(/)에 설치된 서비스워커를 정리하고 스스로 해제한다.
// (루트 서비스워커는 같은 도메인의 다른 사이트까지 가로채므로 남겨 두면 안 된다)
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith('mp-classic-games-')).map(k => caches.delete(k))))
      .then(() => self.registration.unregister())
  );
});
