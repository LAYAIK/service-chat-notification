import webpush from "web-push";

// ⚠️ À générer UNE FOIS avec : npx web-push generate-vapid-keys
const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY || 'BGjdzy0T3UQc90tNpsM2GktJad09RUBbWKRaivkaDuU3Cg0N54CWHlyCf-cnKiD_Txj_6Z8tEgtmd8j3_JhSnV0';
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || 'Aq-xvqeqvZyx2A_JrRe-wllmvFqasWu6dRjmaufTfFs';

webpush.setVapidDetails(
  "cabrelnya@gmail.com",
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

module.exports = {
  webpush,
  VAPID_PUBLIC_KEY,
};