export class CreateAwardedPanelistsResponseDto {
  addedPanelists: string[];
  removedPanelists: string[];
  maintainedPanelists: string[];

  constructor(params: {
    addedPanelists: string[];
    removedPanelists: string[];
    maintainedPanelists: string[];
  }) {
    this.addedPanelists = params.addedPanelists;
    this.removedPanelists = params.removedPanelists;
    this.maintainedPanelists = params.maintainedPanelists;
  }
}
