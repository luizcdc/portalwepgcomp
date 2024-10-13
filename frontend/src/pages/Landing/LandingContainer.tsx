import BotaoComponent from "@/components/UI/BotaoComponent";

export default function LandingContainer() {
    return (
      <div>
        <h1>{process.env.AMBIENTE}</h1>
        <BotaoComponent></BotaoComponent>
      </div>
    );
  }