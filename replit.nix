{ pkgs }: {
  deps = [
    pkgs.bun
    pkgs.nodePackages.typescript
    pkgs.nodePackages.typescript-language-server
    pkgs.openssl
  ];
}