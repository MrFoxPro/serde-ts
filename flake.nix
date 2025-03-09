{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?rev=dad564433178067be1fbdfcce23b546254b6d641";

    flake-parts.url = "github:hercules-ci/flake-parts";

    devenv.url = "github:cachix/devenv?rev=f318d27a4637aff765a378106d82dfded124c3b3"; # https://github.com/cachix/devenv/issues/1513
    devenv.inputs.nixpkgs.follows = "nixpkgs";
  };
  outputs = {self, ...} @ inputs:
    with builtins; let
      lib = inputs.nixpkgs.lib;
    in
      with lib;
        inputs.flake-parts.lib.mkFlake { inherit inputs; specialArgs = {inherit lib;}; }
        ({moduleWithSystem, ...}: {
          imports = with inputs; [devenv.flakeModule];
          systems = ["x86_64-linux"];
          perSystem = { config, system, self', inputs', ... }: let
            pkgs = import inputs.nixpkgs { inherit system; config.allowUnfree = true; };
          in {
            _module.args = {inherit pkgs;};
            devenv.shells.default = {config, ...} @ devenvArgs: let
              inherit (config.devenv) root state profile;
                fromRoot = source: ''
                  pushd ${root}
                    ${source}
                  popd'';
            in {
              enterShell = let
                # ANSI colors: https://en.wikipedia.org/wiki/ANSI_escape_code#8-bit
                commands = pipe devenvArgs.config.scripts [
                  attrNames
                  (groupBy (cmd: elemAt (splitString ":" cmd) 0))
                  (mapAttrsToList (group: commands: let
                    splitted = pipe commands [(sortOn stringLength) (map (removePrefix group)) (concatStringsSep "|")];
                  in "$(tput setaf 226)${group}$(tput sgr0)|${splitted}"))
                  (intersperse "\n")
                  concatStrings
                ];
              in ''
                echo "$(tput setaf 118)Welcome to serde-reflection typescript suite.$(tput sgr0)"
                echo "${commands}" | ${pkgs.unixtools.column}/bin/column --table -W 1 -T 1 -t -s "|"
              '';
              packages = with pkgs; [nodejs_23 nodePackages.pnpm protobuf_28];
              scripts."gen:proto".exec = let outdir = "suite/generated/proto"; in fromRoot ''
                rm -rf ${outdir}; mkdir -p ${outdir}
                ${concatStringsSep " \\\n" [
                  "protoc"
                  "--plugin ${root}/suite/node_modules/.bin/protoc-gen-ts_proto"
                  "--ts_proto_out ${outdir}"
                  "--ts_proto_opt esModuleInterop=true,snakeToCamel=false,forceLong=number,oneof=unions,outputJsonMethods=false,env=both,importSuffix=.js"
                  "--proto_path suite/schema-proto"
                  "--proto_path ${pkgs.protobuf}/include/google/protobuf/"
                  ''$(find suite/schema-proto -iname "*.proto")''
                ]}
              '';
              # TODO pass output file
              scripts."gen:bincode".exec = let outdir = "suite/generated/bincode"; in fromRoot ''
                rm -rf ${outdir}; mkdir -p ${outdir}; cp runtime/* ${outdir}/
                cargo run -p suite
              '';
              scripts."run:test".exec = fromRoot ''
                node --experimental-strip-types --no-warnings suite/test.ts
              '';
              scripts."run:benchmarks".exec = fromRoot ''
                node --experimental-strip-types --no-warnings suite/bench.ts
              '';
              scripts."run:suite".exec = ''
                set -e
                gen:bincode
                gen:proto
                run:test
                run:benchmarks
              '';
            };
          };
        });
}
