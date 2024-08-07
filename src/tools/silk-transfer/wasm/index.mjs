var Module = (() => {
    var _scriptName = import.meta.url;
    return async function (moduleArg = {}) {
      var moduleRtn,
        f = moduleArg,
        aa,
        r,
        ba = new Promise((a, b) => {
          (aa = a), (r = b);
        }),
        ca = typeof window == "object",
        t = typeof importScripts == "function",
        u = false;
      var da = Object.assign({}, f),
        x = "",
        ea,
        A;
      (ca || t) &&
        (t
          ? (x = self.location.href)
          : typeof document < "u" && document.currentScript && (x = document.currentScript.src),
        _scriptName && (x = _scriptName),
        x.startsWith("blob:") ? (x = "") : (x = x.substr(0, x.replace(/[?#].*/, "").lastIndexOf("/") + 1)),
        t &&
          (A = (a) => {
            var b = new XMLHttpRequest();
            return b.open("GET", a, !1), (b.responseType = "arraybuffer"), b.send(null), new Uint8Array(b.response);
          }),
        (ea = (a) =>
          B(a)
            ? new Promise((b, c) => {
                var d = new XMLHttpRequest();
                d.open("GET", a, !0),
                  (d.responseType = "arraybuffer"),
                  (d.onload = () => {
                    (d.status == 200 || (d.status == 0 && d.response)) && c(d.response), b(d.status);
                  }),
                  (d.onerror = b),
                  d.send(null);
              })
            : fetch(a, { credentials: "same-origin" }).then((b) =>
                b.ok ? b.arrayBuffer() : Promise.reject(Error(b.status + " : " + b.url)),
              )));
      f.print || console.log.bind(console);
      var C = f.printErr || console.error.bind(console);
      Object.assign(f, da), (da = null);
      var D;
      f.wasmBinary && (D = f.wasmBinary);
      var F,
        ha = !1,
        ia,
        G,
        H,
        I,
        K,
        L,
        ja,
        ka;
      function la() {
        var a = F.buffer;
        (f.HEAP8 = ia = new Int8Array(a)),
          (f.HEAP16 = H = new Int16Array(a)),
          (f.HEAPU8 = G = new Uint8Array(a)),
          (f.HEAPU16 = I = new Uint16Array(a)),
          (f.HEAP32 = K = new Int32Array(a)),
          (f.HEAPU32 = L = new Uint32Array(a)),
          (f.HEAPF32 = ja = new Float32Array(a)),
          (f.HEAPF64 = ka = new Float64Array(a));
      }
      var ma = [],
        na = [],
        pa = [];
      function qa() {
        var a = f.preRun.shift();
        ma.unshift(a);
      }
      var M = 0,
        ra = null,
        N = null;
      function sa(a) {
        throw (
          (f.onAbort?.(a),
          (a = "Aborted(" + a + ")"),
          C(a),
          (ha = !0),
          (a = new WebAssembly.RuntimeError(a + ". Build with -sASSERTIONS for more info.")),
          r(a),
          a)
        );
      }
      var ta = (a) => a.startsWith("data:application/octet-stream;base64,"),
        B = (a) => a.startsWith("file://"),
        ua;
      function va(a) {
        if (a == ua && D) return new Uint8Array(D);
        if (A) return A(a);
        throw "both async and sync fetching of the wasm failed";
      }
      function wa(a) {
        return D
          ? Promise.resolve().then(() => va(a))
          : ea(a).then(
              (b) => new Uint8Array(b),
              () => va(a),
            );
      }
      function xa(a, b, c) {
        return wa(a)
          .then((d) => WebAssembly.instantiate(d, b))
          .then(c, (d) => {
            C(`failed to asynchronously prepare wasm: ${d}`), sa(d);
          });
      }
      function ya(a, b) {
        var c = ua;
        return D ||
          typeof WebAssembly.instantiateStreaming != "function" ||
          ta(c) ||
          B(c) ||
          u ||
          typeof fetch != "function"
          ? xa(c, a, b)
          : fetch(c, { credentials: "same-origin" }).then((d) =>
              WebAssembly.instantiateStreaming(d, a).then(b, function (e) {
                return (
                  C(`wasm streaming compile failed: ${e}`), C("falling back to ArrayBuffer instantiation"), xa(c, a, b)
                );
              }),
            );
      }
      var za = (a) => {
        for (; 0 < a.length; ) a.shift()(f);
      };
      class Aa {
        constructor(a) {
          this.D = a - 24;
        }
      }
      var Ba = 0,
        Ca = 0,
        Da,
        O = (a) => {
          for (var b = ""; G[a]; ) b += Da[G[a++]];
          return b;
        },
        P = {},
        Q = {},
        R = {},
        S,
        Ea = (a) => {
          throw new S(a);
        },
        Fa,
        Ga = (a, b) => {
          function c(g) {
            if (((g = b(g)), g.length !== d.length)) throw new Fa("Mismatched type converter count");
            for (var m = 0; m < d.length; ++m) T(d[m], g[m]);
          }
          var d = [];
          d.forEach(function (g) {
            R[g] = a;
          });
          var e = Array(a.length),
            k = [],
            l = 0;
          a.forEach((g, m) => {
            Q.hasOwnProperty(g)
              ? (e[m] = Q[g])
              : (k.push(g),
                P.hasOwnProperty(g) || (P[g] = []),
                P[g].push(() => {
                  (e[m] = Q[g]), ++l, l === k.length && c(e);
                }));
          }),
            k.length === 0 && c(e);
        };
      function Ha(a, b, c = {}) {
        var d = b.name;
        if (!a) throw new S(`type "${d}" must have a positive integer typeid pointer`);
        if (Q.hasOwnProperty(a)) {
          if (c.G) return;
          throw new S(`Cannot register type '${d}' twice`);
        }
        (Q[a] = b), delete R[a], P.hasOwnProperty(a) && ((b = P[a]), delete P[a], b.forEach((e) => e()));
      }
      function T(a, b, c = {}) {
        if (!("argPackAdvance" in b)) throw new TypeError("registerType registeredInstance requires argPackAdvance");
        return Ha(a, b, c);
      }
      var Ia = [],
        U = [],
        Ja = (a) => {
          9 < a && --U[a + 1] === 0 && ((U[a] = void 0), Ia.push(a));
        },
        Ka = (a) => {
          if (!a) throw new S("Cannot use deleted val. handle = " + a);
          return U[a];
        },
        La = (a) => {
          switch (a) {
            case void 0:
              return 2;
            case null:
              return 4;
            case !0:
              return 6;
            case !1:
              return 8;
            default:
              let b = Ia.pop() || U.length;
              return (U[b] = a), (U[b + 1] = 1), b;
          }
        };
      function Ma(a) {
        return this.fromWireType(L[a >> 2]);
      }
      var Na = {
          name: "emscripten::val",
          fromWireType: (a) => {
            var b = Ka(a);
            return Ja(a), b;
          },
          toWireType: (a, b) => La(b),
          argPackAdvance: 8,
          readValueFromPointer: Ma,
          C: null,
        },
        Oa = (a, b) => {
          switch (b) {
            case 4:
              return function (c) {
                return this.fromWireType(ja[c >> 2]);
              };
            case 8:
              return function (c) {
                return this.fromWireType(ka[c >> 3]);
              };
            default:
              throw new TypeError(`invalid float width (${b}): ${a}`);
          }
        },
        V = (a, b) => Object.defineProperty(b, "name", { value: a }),
        Pa = (a) => {
          for (; a.length; ) {
            var b = a.pop();
            a.pop()(b);
          }
        };
      function Qa(a) {
        for (var b = 1; b < a.length; ++b) if (a[b] !== null && a[b].C === void 0) return !0;
        return !1;
      }
      function Ta(a) {
        var b = Function;
        if (!(b instanceof Function))
          throw new TypeError(`new_ called with constructor type ${typeof b} which is not a function`);
        var c = V(b.name || "unknownFunctionName", function () {});
        return (c.prototype = b.prototype), (c = new c()), (a = b.apply(c, a)), a instanceof Object ? a : c;
      }
      for (
        var Ua = (a, b) => {
            if (f[a].B === void 0) {
              var c = f[a];
              (f[a] = function (...d) {
                if (!f[a].B.hasOwnProperty(d.length))
                  throw new S(
                    `Function '${b}' called with an invalid number of arguments (${d.length}) - expects one of (${f[a].B})!`,
                  );
                return f[a].B[d.length].apply(this, d);
              }),
                (f[a].B = []),
                (f[a].B[c.F] = c);
            }
          },
          Va = (a, b, c) => {
            if (f.hasOwnProperty(a)) {
              if (c === void 0 || (f[a].B !== void 0 && f[a].B[c] !== void 0))
                throw new S(`Cannot register public name '${a}' twice`);
              if ((Ua(a, a), f.hasOwnProperty(c)))
                throw new S(
                  `Cannot register multiple overloads of a function with the same number of arguments (${c})!`,
                );
              f[a].B[c] = b;
            } else (f[a] = b), c !== void 0 && (f[a].I = c);
          },
          Wa = (a, b) => {
            for (var c = [], d = 0; d < a; d++) c.push(L[(b + 4 * d) >> 2]);
            return c;
          },
          Xa,
          Ya = (a, b, c = []) => (
            a.includes("j")
              ? ((a = a.replace(/p/g, "i")), (b = (0, f["dynCall_" + a])(b, ...c)))
              : (b = Xa.get(b)(...c)),
            b
          ),
          Za =
            (a, b) =>
            (...c) =>
              Ya(a, b, c),
          $a = (a, b) => {
            a = O(a);
            var c = a.includes("j") ? Za(a, b) : Xa.get(b);
            if (typeof c != "function") throw new S(`unknown function pointer with signature ${a}: ${b}`);
            return c;
          },
          ab,
          cb = (a) => {
            a = bb(a);
            var b = O(a);
            return W(a), b;
          },
          db = (a, b) => {
            function c(k) {
              e[k] || Q[k] || (R[k] ? R[k].forEach(c) : (d.push(k), (e[k] = !0)));
            }
            var d = [],
              e = {};
            throw (b.forEach(c), new ab(`${a}: ` + d.map(cb).join([", "])));
          },
          eb = (a) => {
            a = a.trim();
            let b = a.indexOf("(");
            return b !== -1 ? a.substr(0, b) : a;
          },
          fb = (a, b, c) => {
            switch (b) {
              case 1:
                return c ? (d) => ia[d] : (d) => G[d];
              case 2:
                return c ? (d) => H[d >> 1] : (d) => I[d >> 1];
              case 4:
                return c ? (d) => K[d >> 2] : (d) => L[d >> 2];
              default:
                throw new TypeError(`invalid integer width (${b}): ${a}`);
            }
          },
          gb = typeof TextDecoder < "u" ? new TextDecoder() : void 0,
          hb = typeof TextDecoder < "u" ? new TextDecoder("utf-16le") : void 0,
          ib = (a, b) => {
            for (var c = a >> 1, d = c + b / 2; !(c >= d) && I[c]; ) ++c;
            if (((c <<= 1), 32 < c - a && hb)) return hb.decode(G.subarray(a, c));
            for (c = "", d = 0; !(d >= b / 2); ++d) {
              var e = H[(a + 2 * d) >> 1];
              if (e == 0) break;
              c += String.fromCharCode(e);
            }
            return c;
          },
          jb = (a, b, c) => {
            if (((c ??= 2147483647), 2 > c)) return 0;
            c -= 2;
            var d = b;
            c = c < 2 * a.length ? c / 2 : a.length;
            for (var e = 0; e < c; ++e) (H[b >> 1] = a.charCodeAt(e)), (b += 2);
            return (H[b >> 1] = 0), b - d;
          },
          kb = (a) => 2 * a.length,
          lb = (a, b) => {
            for (var c = 0, d = ""; !(c >= b / 4); ) {
              var e = K[(a + 4 * c) >> 2];
              if (e == 0) break;
              ++c,
                65536 <= e
                  ? ((e -= 65536), (d += String.fromCharCode(55296 | (e >> 10), 56320 | (e & 1023))))
                  : (d += String.fromCharCode(e));
            }
            return d;
          },
          mb = (a, b, c) => {
            if (((c ??= 2147483647), 4 > c)) return 0;
            var d = b;
            c = d + c - 4;
            for (var e = 0; e < a.length; ++e) {
              var k = a.charCodeAt(e);
              if (55296 <= k && 57343 >= k) {
                var l = a.charCodeAt(++e);
                k = (65536 + ((k & 1023) << 10)) | (l & 1023);
              }
              if (((K[b >> 2] = k), (b += 4), b + 4 > c)) break;
            }
            return (K[b >> 2] = 0), b - d;
          },
          nb = (a) => {
            for (var b = 0, c = 0; c < a.length; ++c) {
              var d = a.charCodeAt(c);
              55296 <= d && 57343 >= d && ++c, (b += 4);
            }
            return b;
          },
          ob = [],
          pb = (a) => {
            var b = ob.length;
            return ob.push(a), b;
          },
          qb = (a, b) => {
            var c = Q[a];
            if (c === void 0) throw ((a = `${b} has unknown type ${cb(a)}`), new S(a));
            return c;
          },
          rb = (a, b) => {
            for (var c = Array(a), d = 0; d < a; ++d) c[d] = qb(L[(b + 4 * d) >> 2], "parameter " + d);
            return c;
          },
          sb = (a, b, c) => {
            var d = [];
            return (a = a.toWireType(d, c)), d.length && (L[b >> 2] = La(d)), a;
          },
          tb = Array(256),
          X = 0;
        256 > X;
        ++X
      )
        tb[X] = String.fromCharCode(X);
      (Da = tb),
        (S = f.BindingError =
          class extends Error {
            constructor(a) {
              super(a), (this.name = "BindingError");
            }
          }),
        (Fa = f.InternalError =
          class extends Error {
            constructor(a) {
              super(a), (this.name = "InternalError");
            }
          }),
        U.push(0, 1, void 0, 1, null, 1, !0, 1, !1, 1),
        (f.count_emval_handles = () => U.length / 2 - 5 - Ia.length),
        (ab = f.UnboundTypeError =
          ((a, b) => {
            var c = V(b, function (d) {
              (this.name = b),
                (this.message = d),
                (d = Error(d).stack),
                d !== void 0 &&
                  (this.stack =
                    this.toString() +
                    `
` +
                    d.replace(/^Error(:[^\n]*)?\n/, ""));
            });
            return (
              (c.prototype = Object.create(a.prototype)),
              (c.prototype.constructor = c),
              (c.prototype.toString = function () {
                return this.message === void 0 ? this.name : `${this.name}: ${this.message}`;
              }),
              c
            );
          })(Error, "UnboundTypeError"));
      var vb = {
          o: (a, b, c) => {
            var d = new Aa(a);
            throw ((L[(d.D + 16) >> 2] = 0), (L[(d.D + 4) >> 2] = b), (L[(d.D + 8) >> 2] = c), (Ba = a), Ca++, Ba);
          },
          p: () => {
            sa("");
          },
          n: () => {},
          j: (a, b, c, d) => {
            (b = O(b)),
              T(a, {
                name: b,
                fromWireType: function (e) {
                  return !!e;
                },
                toWireType: function (e, k) {
                  return k ? c : d;
                },
                argPackAdvance: 8,
                readValueFromPointer: function (e) {
                  return this.fromWireType(G[e]);
                },
                C: null,
              });
          },
          i: (a) => T(a, Na),
          g: (a, b, c) => {
            (b = O(b)),
              T(a, {
                name: b,
                fromWireType: (d) => d,
                toWireType: (d, e) => e,
                argPackAdvance: 8,
                readValueFromPointer: Oa(b, c),
                C: null,
              });
          },
          h: (a, b, c, d, e, k, l) => {
            var g = Wa(b, c);
            (a = O(a)),
              (a = eb(a)),
              (e = $a(d, e)),
              Va(
                a,
                function () {
                  db(`Cannot call ${a} due to unbound types`, g);
                },
                b - 1,
              ),
              Ga(g, (m) => {
                var h = [m[0], null].concat(m.slice(1));
                m = a;
                var n = a,
                  q = e,
                  p = h.length;
                if (2 > p)
                  throw new S("argTypes array size mismatch! Must at least get return value and 'this' types!");
                var w = h[1] !== null && !1,
                  E = Qa(h),
                  y = h[0].name !== "void";
                q = [n, Ea, q, k, Pa, h[0], h[1]];
                for (var v = 0; v < p - 2; ++v) q.push(h[v + 2]);
                if (!E) for (v = w ? 1 : 2; v < h.length; ++v) h[v].C !== null && q.push(h[v].C);
                (E = Qa(h)), (v = h.length);
                var z = "",
                  J = "";
                for (p = 0; p < v - 2; ++p)
                  (z += (p !== 0 ? ", " : "") + "arg" + p), (J += (p !== 0 ? ", " : "") + "arg" + p + "Wired");
                (z = `
        return function (${z}) {
        if (arguments.length !== ${v - 2}) {
          throwBindingError('function ' + humanName + ' called with ' + arguments.length + ' arguments, expected ${v - 2}');
        }`),
                  E &&
                    (z += `var destructors = [];
`);
                var Ra = E ? "destructors" : "null",
                  oa = "humanName throwBindingError invoker fn runDestructors retType classParam".split(" ");
                for (
                  w &&
                    (z +=
                      "var thisWired = classParam['toWireType'](" +
                      Ra +
                      `, this);
`),
                    p = 0;
                  p < v - 2;
                  ++p
                )
                  (z +=
                    "var arg" +
                    p +
                    "Wired = argType" +
                    p +
                    "['toWireType'](" +
                    Ra +
                    ", arg" +
                    p +
                    `);
`),
                    oa.push("argType" + p);
                if (
                  (w && (J = "thisWired" + (0 < J.length ? ", " : "") + J),
                  (z +=
                    (y || l ? "var rv = " : "") +
                    "invoker(fn" +
                    (0 < J.length ? ", " : "") +
                    J +
                    `);
`),
                  E)
                )
                  z += `runDestructors(destructors);
`;
                else
                  for (p = w ? 1 : 2; p < h.length; ++p)
                    (w = p === 1 ? "thisWired" : "arg" + (p - 2) + "Wired"),
                      h[p].C !== null &&
                        ((z += `${w}_dtor(${w});
`),
                        oa.push(`${w}_dtor`));
                y &&
                  (z += `var ret = retType['fromWireType'](rv);
return ret;
`);
                let [Sa, wb] = [
                  oa,
                  z +
                    `}
`,
                ];
                if ((Sa.push(wb), (h = Ta(Sa)(...q)), (n = V(n, h)), (h = b - 1), !f.hasOwnProperty(m)))
                  throw new Fa("Replacing nonexistent public symbol");
                return f[m].B !== void 0 && h !== void 0 ? (f[m].B[h] = n) : ((f[m] = n), (f[m].F = h)), [];
              });
          },
          b: (a, b, c, d, e) => {
            if (((b = O(b)), e === -1 && (e = 4294967295), (e = (g) => g), d === 0)) {
              var k = 32 - 8 * c;
              e = (g) => (g << k) >>> k;
            }
            var l = b.includes("unsigned")
              ? function (g, m) {
                  return m >>> 0;
                }
              : function (g, m) {
                  return m;
                };
            T(a, {
              name: b,
              fromWireType: e,
              toWireType: l,
              argPackAdvance: 8,
              readValueFromPointer: fb(b, c, d !== 0),
              C: null,
            });
          },
          a: (a, b, c) => {
            function d(k) {
              return new e(ia.buffer, L[(k + 4) >> 2], L[k >> 2]);
            }
            var e = [
              Int8Array,
              Uint8Array,
              Int16Array,
              Uint16Array,
              Int32Array,
              Uint32Array,
              Float32Array,
              Float64Array,
            ][b];
            (c = O(c)), T(a, { name: c, fromWireType: d, argPackAdvance: 8, readValueFromPointer: d }, { G: !0 });
          },
          e: (a, b) => {
            b = O(b);
            var c = b === "std::string";
            T(a, {
              name: b,
              fromWireType: function (d) {
                var e = L[d >> 2],
                  k = d + 4;
                if (c)
                  for (var l = k, g = 0; g <= e; ++g) {
                    var m = k + g;
                    if (g == e || G[m] == 0) {
                      if (l) {
                        var h = l,
                          n = G,
                          q = h + (m - l);
                        for (l = h; n[l] && !(l >= q); ) ++l;
                        if (16 < l - h && n.buffer && gb) h = gb.decode(n.subarray(h, l));
                        else {
                          for (q = ""; h < l; ) {
                            var p = n[h++];
                            if (p & 128) {
                              var w = n[h++] & 63;
                              if ((p & 224) == 192) q += String.fromCharCode(((p & 31) << 6) | w);
                              else {
                                var E = n[h++] & 63;
                                (p =
                                  (p & 240) == 224
                                    ? ((p & 15) << 12) | (w << 6) | E
                                    : ((p & 7) << 18) | (w << 12) | (E << 6) | (n[h++] & 63)),
                                  65536 > p
                                    ? (q += String.fromCharCode(p))
                                    : ((p -= 65536), (q += String.fromCharCode(55296 | (p >> 10), 56320 | (p & 1023))));
                              }
                            } else q += String.fromCharCode(p);
                          }
                          h = q;
                        }
                      } else h = "";
                      if (y === void 0) var y = h;
                      else (y += "\0"), (y += h);
                      l = m + 1;
                    }
                  }
                else {
                  for (y = Array(e), g = 0; g < e; ++g) y[g] = String.fromCharCode(G[k + g]);
                  y = y.join("");
                }
                return W(d), y;
              },
              toWireType: function (d, e) {
                e instanceof ArrayBuffer && (e = new Uint8Array(e));
                var k,
                  l = typeof e == "string";
                if (!(l || e instanceof Uint8Array || e instanceof Uint8ClampedArray || e instanceof Int8Array))
                  throw new S("Cannot pass non-string to std::string");
                var g;
                if (c && l)
                  for (k = g = 0; k < e.length; ++k) {
                    var m = e.charCodeAt(k);
                    127 >= m ? g++ : 2047 >= m ? (g += 2) : 55296 <= m && 57343 >= m ? ((g += 4), ++k) : (g += 3);
                  }
                else g = e.length;
                if (((k = g), (g = ub(4 + k + 1)), (m = g + 4), (L[g >> 2] = k), c && l)) {
                  if (((l = m), (m = k + 1), (k = G), 0 < m)) {
                    m = l + m - 1;
                    for (var h = 0; h < e.length; ++h) {
                      var n = e.charCodeAt(h);
                      if (55296 <= n && 57343 >= n) {
                        var q = e.charCodeAt(++h);
                        n = (65536 + ((n & 1023) << 10)) | (q & 1023);
                      }
                      if (127 >= n) {
                        if (l >= m) break;
                        k[l++] = n;
                      } else {
                        if (2047 >= n) {
                          if (l + 1 >= m) break;
                          k[l++] = 192 | (n >> 6);
                        } else {
                          if (65535 >= n) {
                            if (l + 2 >= m) break;
                            k[l++] = 224 | (n >> 12);
                          } else {
                            if (l + 3 >= m) break;
                            (k[l++] = 240 | (n >> 18)), (k[l++] = 128 | ((n >> 12) & 63));
                          }
                          k[l++] = 128 | ((n >> 6) & 63);
                        }
                        k[l++] = 128 | (n & 63);
                      }
                    }
                    k[l] = 0;
                  }
                } else if (l)
                  for (l = 0; l < k; ++l) {
                    if (((h = e.charCodeAt(l)), 255 < h))
                      throw (W(m), new S("String has UTF-16 code units that do not fit in 8 bits"));
                    G[m + l] = h;
                  }
                else for (l = 0; l < k; ++l) G[m + l] = e[l];
                return d !== null && d.push(W, g), g;
              },
              argPackAdvance: 8,
              readValueFromPointer: Ma,
              C(d) {
                W(d);
              },
            });
          },
          d: (a, b, c) => {
            if (((c = O(c)), b === 2))
              var d = ib,
                e = jb,
                k = kb,
                l = (g) => I[g >> 1];
            else b === 4 && ((d = lb), (e = mb), (k = nb), (l = (g) => L[g >> 2]));
            T(a, {
              name: c,
              fromWireType: (g) => {
                for (var m = L[g >> 2], h, n = g + 4, q = 0; q <= m; ++q) {
                  var p = g + 4 + q * b;
                  (q == m || l(p) == 0) &&
                    ((n = d(n, p - n)), h === void 0 ? (h = n) : ((h += "\0"), (h += n)), (n = p + b));
                }
                return W(g), h;
              },
              toWireType: (g, m) => {
                if (typeof m != "string") throw new S(`Cannot pass non-string to C++ string type ${c}`);
                var h = k(m),
                  n = ub(4 + h + b);
                return (L[n >> 2] = h / b), e(m, n + 4, h + b), g !== null && g.push(W, n), n;
              },
              argPackAdvance: 8,
              readValueFromPointer: Ma,
              C(g) {
                W(g);
              },
            });
          },
          l: (a) => {
            T(a, Na);
          },
          k: (a, b) => {
            (b = O(b)), T(a, { H: !0, name: b, argPackAdvance: 0, fromWireType: () => {}, toWireType: () => {} });
          },
          r: (a, b, c) => G.copyWithin(a, b, b + c),
          u: (a, b, c, d) => ((a = ob[a]), (b = Ka(b)), a(null, b, c, d)),
          c: Ja,
          t: (a, b, c) => {
            b = rb(a, b);
            var d = b.shift();
            a--;
            var e = `return function (obj, func, destructorsRef, args) {
`,
              k = 0,
              l = [];
            c === 0 && l.push("obj");
            for (var g = ["retType"], m = [d], h = 0; h < a; ++h)
              l.push("arg" + h),
                g.push("argType" + h),
                m.push(b[h]),
                (e += `  var arg${h} = argType${h}.readValueFromPointer(args${k ? "+" + k : ""});
`),
                (k += b[h].argPackAdvance);
            return (
              (e += `  var rv = ${c === 1 ? "new func" : "func.call"}(${l.join(", ")});
`),
              d.H ||
                (g.push("emval_returnValue"),
                m.push(sb),
                (e += `  return emval_returnValue(retType, destructorsRef, rv);
`)),
              g.push(
                e +
                  `};
`,
              ),
              (a = Ta(g)(...m)),
              (c = `methodCaller<(${b.map((n) => n.name).join(", ")}) => ${d.name}>`),
              pb(V(c, a))
            );
          },
          m: (a) => {
            9 < a && (U[a + 1] += 1);
          },
          s: (a) => {
            var b = Ka(a);
            Pa(b), Ja(a);
          },
          f: (a, b) => ((a = qb(a, "_emval_take_value")), (a = a.readValueFromPointer(b)), La(a)),
          q: (a) => {
            var b = G.length;
            if (((a >>>= 0), 2147483648 < a)) return !1;
            for (var c = 1; 4 >= c; c *= 2) {
              var d = b * (1 + 0.2 / c);
              d = Math.min(d, a + 100663296);
              var e = Math;
              d = Math.max(a, d);
              a: {
                e =
                  (e.min.call(e, 2147483648, d + ((65536 - (d % 65536)) % 65536)) - F.buffer.byteLength + 65535) /
                  65536;
                try {
                  F.grow(e), la();
                  var k = 1;
                  break a;
                } catch {}
                k = void 0;
              }
              if (k) return !0;
            }
            return !1;
          },
        },
        Y = (function () {
          function a(c) {
            return (
              (Y = c.exports),
              (F = Y.v),
              la(),
              (Xa = Y.A),
              na.unshift(Y.w),
              M--,
              f.monitorRunDependencies?.(M),
              M == 0 && (ra !== null && (clearInterval(ra), (ra = null)), N && ((c = N), (N = null), c())),
              Y
            );
          }
          var b = { a: vb };
          if ((M++, f.monitorRunDependencies?.(M), f.instantiateWasm))
            try {
              return f.instantiateWasm(b, a);
            } catch (c) {
              C(`Module.instantiateWasm callback failed with error: ${c}`), r(c);
            }
          return (
            (ua ||= f.locateFile
              ? ta("silk.wasm")
                ? "silk.wasm"
                : f.locateFile
                  ? f.locateFile("silk.wasm", x)
                  : x + "silk.wasm"
              : new URL("silk.wasm", import.meta.url).href),
            ya(b, function (c) {
              a(c.instance);
            }).catch(r),
            {}
          );
        })(),
        bb = (a) => (bb = Y.x)(a),
        ub = (a) => (ub = Y.y)(a),
        W = (a) => (W = Y.z)(a),
        Z;
      N = function xb() {
        Z || yb(), Z || (N = xb);
      };
      function yb() {
        function a() {
          if (!Z && ((Z = !0), (f.calledRun = !0), !ha)) {
            if ((za(na), aa(f), f.onRuntimeInitialized?.(), f.postRun))
              for (typeof f.postRun == "function" && (f.postRun = [f.postRun]); f.postRun.length; ) {
                var b = f.postRun.shift();
                pa.unshift(b);
              }
            za(pa);
          }
        }
        if (!(0 < M)) {
          if (f.preRun) for (typeof f.preRun == "function" && (f.preRun = [f.preRun]); f.preRun.length; ) qa();
          za(ma),
            0 < M ||
              (f.setStatus
                ? (f.setStatus("Running..."),
                  setTimeout(function () {
                    setTimeout(function () {
                      f.setStatus("");
                    }, 1),
                      a();
                  }, 1))
                : a());
        }
      }
      if (f.preInit)
        for (typeof f.preInit == "function" && (f.preInit = [f.preInit]); 0 < f.preInit.length; ) f.preInit.pop()();
      return yb(), (moduleRtn = ba), moduleRtn;
    };
  })(),
  silk_default = Module;
function isWavFile(fileData) {
  try {
    let chunks = unpackWavFileChunks(fileData),
      fmt = decodeFormatChunk(chunks.get("fmt")),
      data = chunks.get("data");
    return getWavFileType(fmt), verifyDataChunkLength(data, fmt), !0;
  } catch {
    return !1;
  }
}
var audioEncodingNames = ["int", "float"],
  wavFileTypeAudioEncodings = [0, 0, 0, 1];
function decodeWavFile(fileData) {
  let chunks = unpackWavFileChunks(fileData),
    fmt = decodeFormatChunk(chunks.get("fmt")),
    data = chunks.get("data"),
    wavFileType = getWavFileType(fmt),
    audioEncoding = wavFileTypeAudioEncodings[wavFileType],
    wavFileTypeName = audioEncodingNames[audioEncoding] + fmt.bitsPerSample;
  return (
    verifyDataChunkLength(data, fmt),
    {
      channelData: decodeDataChunk(data, fmt, wavFileType),
      sampleRate: fmt.sampleRate,
      numberOfChannels: fmt.numberOfChannels,
      audioEncoding,
      bitsPerSample: fmt.bitsPerSample,
      wavFileTypeName,
    }
  );
}
function unpackWavFileChunks(fileData) {
  let dataView;
  fileData instanceof ArrayBuffer
    ? (dataView = new DataView(fileData))
    : (dataView = new DataView(fileData.buffer, fileData.byteOffset, fileData.byteLength));
  let fileLength = dataView.byteLength;
  if (fileLength < 20) throw new Error("WAV file is too short.");
  if (getString(dataView, 0, 4) != "RIFF") throw new Error("Not a valid WAV file (no RIFF header).");
  let mainChunkLength = dataView.getUint32(4, !0);
  if (8 + mainChunkLength != fileLength)
    throw new Error(`Main chunk length of WAV file (${8 + mainChunkLength}) does not match file size (${fileLength}).`);
  if (getString(dataView, 8, 4) != "WAVE") throw new Error("RIFF file is not a WAV file.");
  let chunks = new Map(),
    fileOffset = 12;
  for (; fileOffset < fileLength; ) {
    if (fileOffset + 8 > fileLength) throw new Error(`Incomplete chunk prefix in WAV file at offset ${fileOffset}.`);
    let chunkId = getString(dataView, fileOffset, 4).trim(),
      chunkLength = dataView.getUint32(fileOffset + 4, !0);
    if (fileOffset + 8 + chunkLength > fileLength)
      throw new Error(`Incomplete chunk data in WAV file at offset ${fileOffset}.`);
    let chunkData = new DataView(dataView.buffer, dataView.byteOffset + fileOffset + 8, chunkLength);
    chunks.set(chunkId, chunkData);
    let padLength = chunkLength % 2;
    fileOffset += 8 + chunkLength + padLength;
  }
  return chunks;
}
function getString(dataView, offset, length) {
  let a = new Uint8Array(dataView.buffer, dataView.byteOffset + offset, length);
  return String.fromCharCode.apply(null, a);
}
function getInt24(dataView, offset) {
  let b0 = dataView.getInt8(offset + 2) * 65536,
    b12 = dataView.getUint16(offset, !0);
  return b0 + b12;
}
function decodeFormatChunk(dataView) {
  if (!dataView) throw new Error("No format chunk found in WAV file.");
  if (dataView.byteLength < 16) throw new Error("Format chunk of WAV file is too short.");
  let fmt = {};
  return (
    (fmt.formatCode = dataView.getUint16(0, !0)),
    (fmt.numberOfChannels = dataView.getUint16(2, !0)),
    (fmt.sampleRate = dataView.getUint32(4, !0)),
    (fmt.bytesPerSec = dataView.getUint32(8, !0)),
    (fmt.bytesPerFrame = dataView.getUint16(12, !0)),
    (fmt.bitsPerSample = dataView.getUint16(14, !0)),
    fmt
  );
}
function getWavFileType(fmt) {
  if (fmt.numberOfChannels < 1 || fmt.numberOfChannels > 999)
    throw new Error("Invalid number of channels in WAV file.");
  let bytesPerSample = Math.ceil(fmt.bitsPerSample / 8),
    expectedBytesPerFrame = fmt.numberOfChannels * bytesPerSample;
  if (
    fmt.formatCode == 1 &&
    fmt.bitsPerSample >= 1 &&
    fmt.bitsPerSample <= 8 &&
    fmt.bytesPerFrame == expectedBytesPerFrame
  )
    return 0;
  if (
    fmt.formatCode == 1 &&
    fmt.bitsPerSample >= 9 &&
    fmt.bitsPerSample <= 16 &&
    fmt.bytesPerFrame == expectedBytesPerFrame
  )
    return 1;
  if (
    fmt.formatCode == 1 &&
    fmt.bitsPerSample >= 17 &&
    fmt.bitsPerSample <= 24 &&
    fmt.bytesPerFrame == expectedBytesPerFrame
  )
    return 2;
  if (fmt.formatCode == 3 && fmt.bitsPerSample == 32 && fmt.bytesPerFrame == expectedBytesPerFrame) return 3;
  throw new Error(
    `Unsupported WAV file type, formatCode=${fmt.formatCode}, bitsPerSample=${fmt.bitsPerSample}, bytesPerFrame=${fmt.bytesPerFrame}, numberOfChannels=${fmt.numberOfChannels}.`,
  );
}
function decodeDataChunk(data, fmt, wavFileType) {
  switch (wavFileType) {
    case 0:
      return decodeDataChunk_uint8(data, fmt);
    case 1:
      return decodeDataChunk_int16(data, fmt);
    case 2:
      return decodeDataChunk_int24(data, fmt);
    case 3:
      return decodeDataChunk_float32(data, fmt);
    default:
      throw new Error("No decoder.");
  }
}
function decodeDataChunk_int16(data, fmt) {
  let channelData = allocateChannelDataArrays(data.byteLength, fmt),
    numberOfChannels = fmt.numberOfChannels,
    numberOfFrames = channelData[0].length,
    offs = 0;
  for (let frameNo = 0; frameNo < numberOfFrames; frameNo++)
    for (let channelNo = 0; channelNo < numberOfChannels; channelNo++) {
      let sampleValueFloat = data.getInt16(offs, !0) / 32768;
      (channelData[channelNo][frameNo] = sampleValueFloat), (offs += 2);
    }
  return channelData;
}
function decodeDataChunk_uint8(data, fmt) {
  let channelData = allocateChannelDataArrays(data.byteLength, fmt),
    numberOfChannels = fmt.numberOfChannels,
    numberOfFrames = channelData[0].length,
    offs = 0;
  for (let frameNo = 0; frameNo < numberOfFrames; frameNo++)
    for (let channelNo = 0; channelNo < numberOfChannels; channelNo++) {
      let sampleValueFloat = (data.getUint8(offs) - 128) / 128;
      (channelData[channelNo][frameNo] = sampleValueFloat), (offs += 1);
    }
  return channelData;
}
function decodeDataChunk_int24(data, fmt) {
  let channelData = allocateChannelDataArrays(data.byteLength, fmt),
    numberOfChannels = fmt.numberOfChannels,
    numberOfFrames = channelData[0].length,
    offs = 0;
  for (let frameNo = 0; frameNo < numberOfFrames; frameNo++)
    for (let channelNo = 0; channelNo < numberOfChannels; channelNo++) {
      let sampleValueFloat = getInt24(data, offs) / 8388608;
      (channelData[channelNo][frameNo] = sampleValueFloat), (offs += 3);
    }
  return channelData;
}
function decodeDataChunk_float32(data, fmt) {
  let channelData = allocateChannelDataArrays(data.byteLength, fmt),
    numberOfChannels = fmt.numberOfChannels,
    numberOfFrames = channelData[0].length,
    offs = 0;
  for (let frameNo = 0; frameNo < numberOfFrames; frameNo++)
    for (let channelNo = 0; channelNo < numberOfChannels; channelNo++) {
      let sampleValueFloat = data.getFloat32(offs, !0);
      (channelData[channelNo][frameNo] = sampleValueFloat), (offs += 4);
    }
  return channelData;
}
function allocateChannelDataArrays(dataLength, fmt) {
  let numberOfFrames = Math.floor(dataLength / fmt.bytesPerFrame),
    channelData = new Array(fmt.numberOfChannels);
  for (let channelNo = 0; channelNo < fmt.numberOfChannels; channelNo++)
    channelData[channelNo] = new Float32Array(numberOfFrames);
  return channelData;
}
function verifyDataChunkLength(data, fmt) {
  if (!data) throw new Error("No data chunk found in WAV file.");
  if (data.byteLength % fmt.bytesPerFrame != 0)
    throw new Error("WAV file data chunk length is not a multiple of frame size.");
}
function getWavFileInfo(fileData) {
  let chunks = unpackWavFileChunks(fileData),
    chunkInfo = getChunkInfo(chunks),
    fmt = decodeFormatChunk(chunks.get("fmt"));
  return { chunkInfo, fmt };
}
function getChunkInfo(chunks) {
  let chunkInfo = [];
  for (let e of chunks) {
    let ci = {};
    (ci.chunkId = e[0]), (ci.dataOffset = e[1].byteOffset), (ci.dataLength = e[1].byteLength), chunkInfo.push(ci);
  }
  return chunkInfo.sort((e1, e2) => e1.dataOffset - e2.dataOffset), chunkInfo;
}
function ensureMonoPcm(channelData) {
  let { length: numberOfChannels } = channelData;
  if (numberOfChannels === 1) return channelData[0];
  let monoData = new Float32Array(channelData[0].length);
  for (let i = 0; i < monoData.length; i++) {
    let sum = 0;
    for (let j = 0; j < numberOfChannels; j++) sum += channelData[j][i];
    monoData[i] = sum / numberOfChannels;
  }
  return monoData;
}
function ensureS16lePcm(input) {
  let fileLength = input.length * 2,
    arrayBuffer = new ArrayBuffer(fileLength),
    int16Array = new Int16Array(arrayBuffer);
  for (let offset = 0; offset < input.length; offset++) {
    let x = ~~(input[offset] * 32768);
    int16Array[offset] = x > 32767 ? 32767 : x;
  }
  return arrayBuffer;
}
function toUTF8String(input, start = 0, end = input.byteLength) {
  return new TextDecoder().decode(input.slice(start, end));
}
function binaryFromSource(source) {
  return ArrayBuffer.isView(source)
    ? source.buffer.slice(source.byteOffset, source.byteOffset + source.byteLength)
    : source;
}
async function encode(input, sampleRate) {
  let instance = await silk_default(),
    buffer = binaryFromSource(input);
  if (buffer.byteLength === 0) throw new Error("input data length is 0");
  if (isWavFile(input)) {
    let { channelData, sampleRate: wavSampleRate } = decodeWavFile(input);
    (sampleRate ||= wavSampleRate), (buffer = ensureS16lePcm(ensureMonoPcm(channelData)));
  }
  let data = new Uint8Array(),
    duration = instance.silk_encode(buffer, sampleRate, (output) => {
      output.length > 0 && (data = output.slice(0, -1));
    });
  if (duration === 0) throw new Error("silk encoding failure");
  return { data, duration };
}
async function decode(input, sampleRate) {
  let instance = await silk_default(),
    buffer = binaryFromSource(input);
  if (buffer.byteLength === 0) throw new Error("input data length is 0");
  let data = new Uint8Array(),
    duration = instance.silk_decode(buffer, sampleRate, (output) => {
      output.length > 0 && (data = output.slice());
    });
  if (duration === 0) throw new Error("silk decoding failure");
  return { data, duration };
}
function getDuration(data, frameMs = 20) {
  let buffer = binaryFromSource(data),
    view = new DataView(buffer),
    byteLength = view.byteLength,
    offset = view.getUint8(0) === 2 ? 10 : 9,
    blocks = 0;
  for (; offset < byteLength; ) {
    let size = view.getUint16(offset, !0);
    (blocks += 1), (offset += size + 2);
  }
  return blocks * frameMs;
}
function isWav(data) {
  return isWavFile(data);
}
function getWavFileInfo2(data) {
  return getWavFileInfo(data);
}
function isSilk(data) {
  let buffer = binaryFromSource(data);
  return buffer.byteLength < 7 ? !1 : toUTF8String(buffer, 0, 7).includes("#!SILK");
}
export { decode, encode, getDuration, getWavFileInfo2 as getWavFileInfo, isSilk, isWav };
