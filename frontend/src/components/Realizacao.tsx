"use client";
import logo_jusbrasil from "@/assets/images/logo_jusbrasil.svg";
import logo_ufba from "@/assets/images/logo_ufba.svg";
import logo_computacao from "@/assets/images/logo_computacao.svg";

export default function Realizacao() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        height: "240px",
        gap: "30%",
        margin: "30px",
        marginLeft: "70px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          gap: "30px",
        }}
      >
        <div
          style={{
            color: "black",
            fontWeight: 700,
            fontSize: "24px",
          }}
        >
          Realização:
        </div>

        <div
          style={{
            backgroundImage: `url(${logo_computacao.src})`,
            backgroundSize: "cover",
            width: "240px",
            height: "70px",
          }}
        ></div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          gap: "10px",
        }}
      >
        <div
          style={{
            color: "black",
            fontWeight: 700,
            fontSize: "24px",
          }}
        >
          Apoio:
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center ",
            gap: "50px",
          }}
        >
          <div
            style={{
              backgroundImage: `url(${logo_ufba.src})`,
              backgroundSize: "cover",
              width: "138px",
              height: "89px",
            }}
          ></div>

          <div
            style={{
              backgroundImage: `url(${logo_jusbrasil.src})`,
              backgroundSize: "cover",
              width: "208px",
              height: "32px",
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}
