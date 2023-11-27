import { App, Plugin, PluginSettingTab, Setting } from 'obsidian';
// import { exec } from 'child_process'
import * as net from 'net'

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
	imSelect: string;
	interval: number;
	chineseIME: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	imSelect: '/usr/local/bin/im-select',
	interval: 500,
	chineseIME: 'im.rime.inputmethod.Squirrel.Hans',
}

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();
		this.addSettingTab(new SampleSettingTab(this.app, this))
		// this.registerInterval(window.setInterval(() =>{
		// 	exec(this.settings.imSelect, (error, stdout, stderr) =>{
		// 		if (error) {
		// 			console.log(`error: ${error.message}`);
		// 			return;
		// 		}
		// 		if (stderr) {
		// 			console.log(`stderr: ${stderr}`);
		// 			return;
		// 		}
		// 		const flag = stdout.trim() === this.settings.chineseIME
		// 		document.querySelectorAll('.markdown-source-view').forEach(el => {
		// 			el.classList.toggle('chinese', flag)
		// 		})
		// 	})
		// }, this.settings.interval || 500))

		const client = net.createConnection({ path: '/tmp/im-event.sock' }, () => {
			console.log('TCP Connected!')
		})

		client.on('data', (data: Buffer) => {
			console.log('ondata:', data.toString())
			this.handleInputSource(data.toString())
			
		})

		client.on('end', () => {
			console.log('TCP End!')
		})

		client.on('error', (err: Error) => {
			console.error('TCP Error:', err)
		})

		// 定时、手动重连，考虑增加一个 UI 实时展示连接状态。
	}

	handleInputSource(inputSource: string) {
		const flag = inputSource.trim() === this.settings.chineseIME
		document.querySelectorAll('.markdown-source-view').forEach(el => {
			el.classList.toggle('chinese', flag)
		})
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'Settings for my awesome plugin.'});

		new Setting(containerEl)
			.setName('im-select path')
			.setDesc('im-select absolute path')
			.addText(text => text
				.setPlaceholder('/usr/local/bin/im-select')
				.setValue(this.plugin.settings.imSelect)
				.onChange(async (value) => {
					this.plugin.settings.imSelect = value;
					await this.plugin.saveSettings();
				}));

				new Setting(containerEl)
				.setName('im-select update interval')
				.setDesc('ms of running im-select command')
				.addText(text => text
					.setPlaceholder('500')
					.setValue(`${this.plugin.settings.interval}`)
					.onChange(async (value) => {
						this.plugin.settings.interval = parseInt(value);
						await this.plugin.saveSettings();
					}));

		new Setting(containerEl)
			.setName('im-select source')
			.setDesc('the source which will be highlight')
			.addText(text => text
				.setPlaceholder('im.rime.inputmethod.Squirrel.Hans')
				.setValue(this.plugin.settings.chineseIME)
				.onChange(async (value) => {
					this.plugin.settings.chineseIME = value;
					await this.plugin.saveSettings();
				}));
	}
}