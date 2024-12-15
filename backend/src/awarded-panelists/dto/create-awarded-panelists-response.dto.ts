export class CreateAwardedPanelistsResponseDto {
  newAwardedPanelists: string[];
  alreadyAwardedPanelists: string[];

  constructor(params: {
    newAwardedPanelists: string[];
    alreadyAwardedPanelists: string[];
  }) {
    this.newAwardedPanelists = params.newAwardedPanelists;
    this.alreadyAwardedPanelists = params.alreadyAwardedPanelists;
  }
}
