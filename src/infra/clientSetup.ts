// clientSetup.ts
const originalLog = console.log;
console.log = function (...args) {
  window.__capturedLogs = [...(window.__capturedLogs || []), args.join(" ")];
  originalLog.apply(console, args);
};

const originalError = console.error;
console.error = function (...args) {
  window.__capturedLogs = [
    ...(window.__capturedLogs || []),
    "[ERROR] " + args.join(" "),
  ];
  originalError.apply(console, args);
};
